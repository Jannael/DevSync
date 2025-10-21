/***
  This function its to the auth-flow, first you request a code, then you verified it, with that cookie
  you are able to create a user, also here we generate the accessTokens you need
***/

import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { encrypt, decrypt, generateCode, sendEmail, verifyEmail } from '../../utils/utils'
import dotenv from 'dotenv'
import model from '../../model/auth/model'
import config from '../../config/config'
import { IEnv } from '../../interface/env'
import { Types } from 'mongoose'
import { DatabaseError, NotFound, UserBadRequest } from '../../error/error'

dotenv.config({ quiet: true })
const { JWT_ACCESS_TOKEN_ENV, JWT_REFRESH_TOKEN_ENV, JWT_AUTH_ENV, TEST_PWD_ENV, CRYPTO_AUTH_ENV } = process.env as Pick<IEnv,
'JWT_ACCESS_TOKEN_ENV' |
'JWT_REFRESH_TOKEN_ENV' |
'JWT_AUTH_ENV' |
'TEST_PWD_ENV' |
'CRYPTO_AUTH_ENV'>

const functions = {
  request: {
    code: async function (req: Request, res: Response): Promise<boolean> {
      let code = generateCode()
      if (req.body?.account === undefined ||
        !verifyEmail(req.body?.account)
      ) throw new UserBadRequest('Missing or invalid account, the account must match the following pattern example@service.ext')

      if (req.body?.TEST_PWD !== undefined &&
        req.body?.TEST_PWD === TEST_PWD_ENV
      ) code = generateCode(req.body.TEST_PWD)

      if (req.body?.TEST_PWD === undefined) await sendEmail(req.body.account, code)

      const jwtToken = jwt.sign({
        code,
        account: req.body.account
      }, JWT_AUTH_ENV, config.jwt.code)

      const jwtEncrypt = encrypt(jwtToken, CRYPTO_AUTH_ENV)
      res.cookie('code', jwtEncrypt, config.cookies.code)
      return true
    },
    accessToken: async function (req: Request, res: Response): Promise<boolean> {
      if (req.cookies.refreshToken === undefined) throw new UserBadRequest('You need to login')
      let refreshToken
      const decoded = jwt.decode(req.cookies.refreshToken)

      try {
        refreshToken = jwt.verify(req.cookies.refreshToken, JWT_REFRESH_TOKEN_ENV)
      } catch (e) {
        if ((e as Error).name === 'TokenExpiredError' &&
          decoded !== null &&
          typeof decoded !== 'string' &&
          decoded._id !== undefined) {
          await model.auth.refreshToken.remove(req.cookies.refreshToken, decoded._id)
        }
        throw e
      }

      if (typeof refreshToken === 'string') throw new UserBadRequest('Invalid credentials')

      const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken, refreshToken._id as Types.ObjectId)
      if (!dbValidation) throw new DatabaseError('the validation has failed please try again')

      delete refreshToken.iat
      delete refreshToken.exp

      const accessToken = jwt.sign(refreshToken, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)
      return true
    },
    refreshToken: {
      code: async function (req: Request, res: Response): Promise<boolean> {
        if (req.body?.account === undefined ||
        req.body?.pwd === undefined ||
        !verifyEmail(req.body?.account)
        ) throw new UserBadRequest('Missing or invalid data the account must match the following pattern example@service.ext')

        let code = generateCode()

        if (req.body?.TEST_PWD !== undefined &&
          req.body?.TEST_PWD === TEST_PWD_ENV
        ) code = generateCode(req.body.TEST_PWD)

        const user = await model.verify.login(req.body.account, req.body.pwd)

        if (req.body?.TEST_PWD === undefined) await sendEmail(req.body.account, code)

        const jwtToken = jwt.sign(user, JWT_AUTH_ENV, config.jwt.code)
        const jwtHashCode = jwt.sign({ code }, JWT_AUTH_ENV, config.jwt.code)
        const token = encrypt(jwtToken, CRYPTO_AUTH_ENV)
        const hashCode = encrypt(jwtHashCode, CRYPTO_AUTH_ENV)

        res.cookie('tokenR', token, config.cookies.code)
        res.cookie('codeR', hashCode, config.cookies.code)

        return true
      },
      confirm: async function (req: Request, res: Response): Promise<boolean> {
        if (req.cookies?.tokenR === undefined ||
          req.cookies?.codeR === undefined ||
          req.body?.code === undefined
        ) throw new UserBadRequest('You need to use MFA for login')

        const code = jwt.verify(req.cookies.codeR, JWT_AUTH_ENV)
        if (typeof code === 'string') throw new UserBadRequest('Forbidden')
        if (code.code !== req.body.code) throw new UserBadRequest('Wrong code')

        const user = jwt.verify(req.cookies?.tokenR, JWT_AUTH_ENV)
        if (typeof user === 'string') throw new UserBadRequest('Forbidden')

        delete user.iat
        delete user.exp

        const refreshToken = jwt.sign(user, JWT_REFRESH_TOKEN_ENV, config.jwt.refreshToken)
        const accessToken = jwt.sign(user, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken)

        const savedInDB = await model.auth.refreshToken.save(refreshToken, user._id)
        if (!savedInDB) throw new DatabaseError('something went wrong please try again')

        res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
        res.cookie('accessToken', accessToken, config.cookies.accessToken)
        res.clearCookie('tokenR')
        res.clearCookie('codeR')

        return true
      }
    },
    logout: async function (req: Request, res: Response): Promise<boolean> {
      if (req.cookies.refreshToken === undefined) return true

      const decoded = jwt.verify(req.cookies.refreshToken, JWT_REFRESH_TOKEN_ENV)
      if (typeof decoded === 'string') throw new UserBadRequest('Invalid credentials')
      await model.auth.refreshToken.remove(req.cookies.refreshToken, decoded._id)

      res.clearCookie('refreshToken')
      res.clearCookie('accessToken')
      return true
    }
  },
  verify: {
    code: async function (req: Request, res: Response): Promise<boolean> {
      if (req.body?.code === undefined ||
        req.cookies?.code === undefined
      ) throw new UserBadRequest('Missing code')

      const token = decrypt(req.cookies.code, CRYPTO_AUTH_ENV)
      const decodedCode = jwt.verify(token, JWT_AUTH_ENV)
      if (typeof decodedCode === 'string') throw new UserBadRequest('Forbidden')

      if (req.body?.code !== decodedCode.code) throw new UserBadRequest('Wrong code')
      if (req.body?.account !== decodedCode.account) throw new UserBadRequest('You tried to change the account now your banned forever')

      res.clearCookie('code')

      const jwtToken = jwt.sign({ account: decodedCode.account }, JWT_AUTH_ENV, config.jwt.code)
      const encrypted = encrypt(jwtToken, CRYPTO_AUTH_ENV)
      res.cookie('account', encrypted, config.cookies.code)
      return true
    }
  },
  account: {
    request: {
      code: async function (req: Request, res: Response): Promise<boolean> {
        let code = generateCode()
        let codeNewAccount = generateCode()

        if (req.cookies.accessToken === undefined ||
          req.body?.newAccount === undefined ||
          !verifyEmail(req.body?.newAccount)
        ) throw new UserBadRequest('Not authorized')

        const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV)
        if (typeof accessToken === 'string') throw new UserBadRequest('Invalid accessToken')

        if (req.body?.TEST_PWD !== undefined &&
          req.body?.TEST_PWD === TEST_PWD_ENV
        ) {
          code = generateCode(TEST_PWD_ENV)
          codeNewAccount = generateCode(TEST_PWD_ENV)
        }

        if (req.body?.TEST_PWD === undefined) {
          await sendEmail(accessToken.account, code)
          await sendEmail(req.body.newAccount, code)
        }

        const codeEncrypted = jwt.sign({ code }, JWT_AUTH_ENV, config.jwt.code)
        const codeNewAccountEncrypted = jwt.sign({ code: codeNewAccount, account: req.body.newAccount }, JWT_AUTH_ENV, config.jwt.codeNewAccount)

        res.cookie('currentAccount', codeEncrypted, config.cookies.code)
        res.cookie('newAccount', codeNewAccountEncrypted, config.cookies.codeNewAccount)

        return true
      }
    },
    verify: {
      code: async function (req: Request, res: Response): Promise<boolean> {
        if (req.cookies?.currentAccount === undefined ||
          req.cookies?.newAccount === undefined ||
          req.cookies?.accessToken === undefined ||
          req.body?.codeCurrentAccount === undefined ||
          req.body?.codeNewAccount === undefined
        ) throw new UserBadRequest('You need to ask for verification codes')

        const code = jwt.verify(req.cookies.currentAccount, JWT_AUTH_ENV) as JwtPayload
        const codeNewAccount = jwt.verify(req.cookies.newAccount, JWT_AUTH_ENV) as JwtPayload
        const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV) as JwtPayload

        if (typeof code === 'string' ||
          typeof codeNewAccount === 'string' ||
          typeof accessToken === 'string'
        ) throw new UserBadRequest('Forbidden')

        if (code.code !== req.body.codeCurrentAccount) throw new UserBadRequest('Current account code is wrong')
        if (codeNewAccount.code !== req.body.codeNewAccount) throw new UserBadRequest('New account code is wrong')

        res.clearCookie('currentAccount')
        res.clearCookie('newAccount')

        const account = jwt.sign({ account: codeNewAccount.account }, JWT_AUTH_ENV, config.jwt.code)

        res.cookie('newAccount_account', account, config.cookies.code)
        return true
      }
    }
  },
  pwd: {
    request: {
      code: async function (req: Request, res: Response): Promise<boolean> {
        if (req.body?.account === undefined ||
          !verifyEmail(req.body?.account)
        ) throw new UserBadRequest('Missing or invalid account it must match example@service.ext')

        const dbValidation = await model.verify.user(req.body.account)
        if (!dbValidation) throw new NotFound('This user does not exist')

        let code = generateCode()
        if (req.body?.TEST_PWD !== undefined &&
          req.body?.TEST_PWD === TEST_PWD_ENV
        ) code = generateCode(TEST_PWD_ENV)

        if (req.body?.TEST_PWD === undefined) await sendEmail(req.body?.account, code)

        const hashCode = jwt.sign({ code, account: req.body?.account }, JWT_AUTH_ENV, config.jwt.code)
        res.cookie('pwdChange', hashCode, config.cookies.code)
        return true
      }
    },
    verify: {
      code: async function (req: Request, res: Response): Promise<boolean> {
        if (req.body?.code === undefined ||
          req.cookies.pwdChange === undefined ||
          req.body?.newPwd === undefined ||
          req.body?.account === undefined
        ) throw new UserBadRequest('Missing data')

        const code = jwt.verify(req.cookies.pwdChange, JWT_AUTH_ENV)
        if (typeof code === 'string') throw new UserBadRequest('Invalid token')

        if (code.code !== req.body?.code) throw new UserBadRequest('Wrong code')
        if (code.account !== req.body?.account) throw new UserBadRequest('You tried to change the account now your banned forever')

        const hash = jwt.sign({ pwd: req.body?.newPwd, account: code.account }, JWT_AUTH_ENV, config.jwt.code)

        res.cookie('newPwd', hash, config.cookies.code)
        res.clearCookie('pwdChange')
        return true
      }
    }
  }
}

export default functions
