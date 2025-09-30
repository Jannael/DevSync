/***
  This function its to the auth-flow, first you request a code, then you verified it, with that cookie
  you are able to create a user, also here we generate the accessTokens you need
***/

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { generateCode, sendEmail } from '../../utils/utils'
import dotenv from 'dotenv'
import model from '../../model/auth/model'
import config from '../../config/config'
import { IUser } from '../../interface/user'
import { IEnv } from '../../interface/env'
import { Schema } from 'mongoose'
import { DatabaseError, ServerError, UserBadRequest } from '../../error/error'

dotenv.config({ quiet: true })
const { JWT_ACCESSTOKEN_ENV, JWT_REFRESHTOKEN_ENV, JWT_AUTH_ENV } = process.env as Pick<IEnv,
'JWT_ACCESSTOKEN_ENV' |
'JWT_REFRESHTOKEN_ENV' |
'JWT_AUTH_ENV'>
const { ObjectId } = Schema.Types

const functions = {
  request: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean, error?: Error }> {
      if (req.body.account === undefined) throw new UserBadRequest('Missing account')

      const code = generateCode()
      await sendEmail(req.body.account, code)

      const codeHash = jwt.sign({ code }, JWT_AUTH_ENV, config.jwt.code as SignOptions)
      res.cookie('code', codeHash, config.cookies.code)
      return { complete: true }
    },
    accessToken: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      if (req.cookies.refreshToken === undefined) throw new UserBadRequest('You need to login')

      const refreshToken = jwt.verify(req.cookies.refreshToken, JWT_REFRESHTOKEN_ENV) as IUser
      const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken, refreshToken._id as typeof ObjectId)
      if (!dbValidation) { return { complete: false } }

      const accessToken = jwt.sign(refreshToken, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)
      return { complete: true }
    },
    refreshToken: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      if (req.body.account === undefined || req.body.pwd === undefined) throw new UserBadRequest('Missing data')

      const user = (await model.verify.login(req.body.account, req.body.pwd))

      const refreshToken = jwt.sign(user, JWT_REFRESHTOKEN_ENV, config.jwt.refreshToken as SignOptions)
      const accessToken = jwt.sign(user, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)

      const saveRefreshToken = await model.auth.refreshToken.save(refreshToken, user._id as typeof ObjectId)
      if (!saveRefreshToken) { throw new DatabaseError('Something went wrong please try again') }

      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)

      return { complete: true }
    }
  },
  verify: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      if (req.body.code === undefined || req.cookies.code === undefined) throw new UserBadRequest('Missing code')

      const decodedCode = jwt.verify(req.cookies.code, JWT_AUTH_ENV) as JwtPayload
      if (typeof decodedCode === 'string') throw new UserBadRequest('Forbidden')
      if (req.body.code !== decodedCode.code) throw new UserBadRequest('Wrong code')

      const emailHash = jwt.sign(req.body.account, JWT_AUTH_ENV, config.jwt.code as SignOptions)
      res.cookie('account', emailHash, config.cookies.code)
      return { complete: true }
    }
  },
  account: {
    request: {
      code: async function (req: Request, res: Response) {
        if (req.cookies.accessToken === undefined ||
          req.body.newAccount === undefined
        ) throw new UserBadRequest('Not authorized')

        const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESSTOKEN_ENV)
        if (typeof accessToken === 'string') throw new UserBadRequest('Invalid accessToken')

        const code = generateCode()
        const codeNewAccount = generateCode()

        const codeResult = await sendEmail(accessToken.account, code)
        const codeNewAccountResult = await sendEmail(req.body.newAccount, codeNewAccount)

        if (!codeResult || !codeNewAccountResult) throw new ServerError('Something went wrong please try again later')

        const codeEncrypted = jwt.sign({ code }, JWT_AUTH_ENV, config.jwt.code as SignOptions)
        const codeNewAccountEncrypted = jwt.sign({ code: codeNewAccount, account: req.body.newAccount }, JWT_AUTH_ENV, config.jwt.codeNewAccount as SignOptions)

        res.cookie('account', codeEncrypted, config.cookies.code)
        res.cookie('newAccount', codeNewAccountEncrypted, config.cookies.codeNewAccount)

        return { complete: true }
      }
    },
    verify: {
      code: async function (req: Request, res: Response) {
        if (req.cookies.account === undefined ||
          req.cookies.newAccount === undefined ||
          req.cookies.accessToken === undefined ||
          req.body.codeCurrentAccount === undefined ||
          req.body.codeNewAccount === undefined
        ) throw new UserBadRequest('You need to ask for verificaction codes')

        const { code } = jwt.verify(req.cookies.account, JWT_AUTH_ENV) as JwtPayload
        const codeNewAccount = jwt.verify(req.cookies.newAccount, JWT_AUTH_ENV) as JwtPayload
        const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESSTOKEN_ENV) as JwtPayload

        if (typeof code === 'string' ||
          typeof codeNewAccount === 'string' ||
          typeof accessToken === 'string'
        ) throw new UserBadRequest('Forbidden')

        if (code !== req.body.codeCurrentAccount) throw new UserBadRequest('Current account code is wrong')
        if (codeNewAccount.code !== req.body.codeNewAccount) throw new UserBadRequest('New account code is wrong')

        res.clearCookie('account')
        res.clearCookie('newAccount')

        const account = jwt.sign(codeNewAccount.account, JWT_AUTH_ENV, config.jwt.code)

        res.cookie('newAccount_account', account, config.cookies.code)
        return { complete: true }
      }
    }
  }
}

export default functions
