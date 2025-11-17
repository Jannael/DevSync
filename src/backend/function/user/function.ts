/***
  User's CRUD
***/

import { IRefreshToken, IUser, IUserInvitation } from '../../interface/user'
import model from './../../model/user/model'
import authModel from './../../model/auth/model'
import validator from '../../validator/validator'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import config from './../../config/config'
import { DatabaseError, Forbidden, UserBadRequest } from '../../error/error'
import { IEnv } from '../../interface/env'
import { decrypt, encrypt } from '../../utils/utils'
import getToken from '../../utils/token'

dotenv.config({ quiet: true })
const {
  JWT_ACCESS_TOKEN_ENV,
  JWT_REFRESH_TOKEN_ENV,
  JWT_AUTH_ENV,
  CRYPTO_ACCESS_TOKEN_ENV,
  CRYPTO_AUTH_ENV,
  CRYPTO_REFRESH_TOKEN_ENV
} = process.env as Pick<IEnv,
'JWT_ACCESS_TOKEN_ENV' |
'JWT_REFRESH_TOKEN_ENV' |
'JWT_AUTH_ENV' |
'CRYPTO_ACCESS_TOKEN_ENV' |
'CRYPTO_AUTH_ENV' |
'CRYPTO_REFRESH_TOKEN_ENV'>

const functions = {
  get: async function (req: Request, res: Response): Promise<IRefreshToken> {
    if (req.cookies.accessToken === undefined) throw new UserBadRequest('Invalid credentials', 'Missing accessToken')
    const jwtAccessToken = decrypt(req.cookies.accessToken, CRYPTO_ACCESS_TOKEN_ENV, 'accessToken')

    const accessToken = jwt.verify(jwtAccessToken, JWT_ACCESS_TOKEN_ENV)

    if (typeof accessToken === 'string') throw new UserBadRequest('Invalid credentials', 'Invalid accessToken')

    delete accessToken.iat
    delete accessToken.exp
    delete accessToken._id

    return accessToken as IRefreshToken
  },
  create: async function (req: Request, res: Response): Promise<IRefreshToken> {
    if (req.cookies?.account === undefined ||
        req.body === undefined) throw new UserBadRequest('Invalid credentials', 'Account not verified')

    const jwtAccount = decrypt(req.cookies.account, CRYPTO_AUTH_ENV, 'account token')
    const decoded = jwt.verify(jwtAccount, JWT_AUTH_ENV)
    if (typeof decoded === 'string') throw new UserBadRequest('Invalid credentials', 'Account not verified')
    if (decoded.account !== req.body.account) throw new UserBadRequest('Invalid credentials', 'Verified account does not match the sent account')

    req.body.account = decoded.account

    const validData = validator.user.create(req.body)
    const result = await model.create(validData)

    const jwtRefreshToken = jwt.sign(result, JWT_REFRESH_TOKEN_ENV, config.jwt.refreshToken as SignOptions)
    const jwtAccessToken = jwt.sign(result, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken as SignOptions)
    const refreshToken = encrypt(jwtRefreshToken, CRYPTO_REFRESH_TOKEN_ENV)
    const accessToken = encrypt(jwtAccessToken, CRYPTO_ACCESS_TOKEN_ENV)

    res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
    res.cookie('accessToken', accessToken, config.cookies.accessToken)
    res.clearCookie('account')

    delete (result as IUser)._id

    return result
  },
  update: async function (req: Request, res: Response): Promise<IRefreshToken> {
    if (req.body?.account !== undefined ||
        req.body?.refreshToken !== undefined ||
        req.body?._id !== undefined ||
        req.cookies?.account === undefined ||
        req.cookies?.accessToken === undefined
    ) throw new UserBadRequest('Missing data', 'The\'res missing credentials, make sure to get them before update')

    const jwtAccountCookie = decrypt(req.cookies.account, CRYPTO_AUTH_ENV, 'accountToken')
    const jwtAccessToken = decrypt(req.cookies.accessToken, CRYPTO_ACCESS_TOKEN_ENV, 'accessToken')

    const accountCookie = jwt.verify(jwtAccountCookie, JWT_AUTH_ENV)
    const accessToken = jwt.verify(jwtAccessToken, JWT_ACCESS_TOKEN_ENV)

    if (typeof accountCookie === 'string' ||
        typeof accessToken === 'string'
    ) throw new UserBadRequest('Invalid credentials', 'Account not verified')

    if (accessToken.account !== accountCookie.account) throw new UserBadRequest('Invalid credentials', 'The account verified and your account does not match')

    const data = validator.user.partial(req.body)
    if (data === null) throw new UserBadRequest('Missing data', 'No data to update or invalid data')

    const result = await model.update(data, accessToken._id)
    const jwtNewRefreshToken = jwt.sign(result, JWT_REFRESH_TOKEN_ENV, config.jwt.refreshToken)
    const jwtNewAccessToken = jwt.sign(result, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken)
    const newRefreshToken = encrypt(jwtNewRefreshToken, CRYPTO_REFRESH_TOKEN_ENV)
    const newAccessToken = encrypt(jwtNewAccessToken, CRYPTO_ACCESS_TOKEN_ENV)

    const isSaved = await authModel.refreshToken.save(newRefreshToken, accessToken._id)
    if (!isSaved) throw new DatabaseError('Failed to save', 'Something went wrong please try again')

    res.cookie('refreshToken', newRefreshToken, config.cookies.refreshToken)
    res.cookie('accessToken', newAccessToken, config.cookies.accessToken)
    res.clearCookie('account')

    delete (result as IUser)._id
    return result
  },
  delete: async function (req: Request, res: Response): Promise<boolean> {
    if (req.cookies.account === undefined ||
        req.cookies.accessToken === undefined
    ) throw new UserBadRequest('Missing data', 'Account not verified')

    const jwtAccessToken = decrypt(req.cookies.accessToken, CRYPTO_ACCESS_TOKEN_ENV, 'accessToken')
    const jwtCookieAccount = decrypt(req.cookies.account, CRYPTO_AUTH_ENV, 'accountToken')

    const accessToken = jwt.verify(jwtAccessToken, JWT_ACCESS_TOKEN_ENV) as JwtPayload
    const cookieAccount = jwt.verify(jwtCookieAccount, JWT_AUTH_ENV) as JwtPayload

    if (typeof accessToken === 'string' ||
        typeof cookieAccount === 'string'
    ) throw new UserBadRequest('Invalid credentials')

    if (accessToken.account !== cookieAccount.account) throw new UserBadRequest('Invalid credentials', 'The verified account and yours does not match')

    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    res.clearCookie('account')

    return await model.delete(accessToken._id)
  },
  account: {
    update: async function (req: Request, res: Response): Promise<IRefreshToken> {
      const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV)
      const newAccount = getToken(req, 'newAccount_account', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)

      if (typeof accessToken === 'string' ||
          typeof newAccount === 'string'
      ) throw new UserBadRequest('Invalid credentials')

      const response = await model.account.update(accessToken._id, newAccount.account)
      const jwtNewRefreshToken = jwt.sign(response, JWT_REFRESH_TOKEN_ENV, config.jwt.refreshToken)
      const jwtNewAccessToken = jwt.sign(response, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken)
      const newRefreshToken = encrypt(jwtNewRefreshToken, CRYPTO_REFRESH_TOKEN_ENV)
      const newAccessToken = encrypt(jwtNewAccessToken, CRYPTO_ACCESS_TOKEN_ENV)

      const isSaved = await authModel.refreshToken.save(newRefreshToken, accessToken._id)
      if (!isSaved) throw new DatabaseError('Failed to save', 'Something went wrong please try again')

      res.cookie('refreshToken', newRefreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', newAccessToken, config.cookies.accessToken)
      res.clearCookie('newAccount_account')

      delete (response as any)._id

      return response
    }
  },
  password: {
    update: async function (req: Request, res: Response): Promise<boolean> {
      if (req.cookies?.newPwd === undefined) throw new UserBadRequest('Missing data', 'Make sure to follow the auth flow for this operation')

      const jwtNewPwd = decrypt(req.cookies.newPwd, CRYPTO_AUTH_ENV, 'newPwdToken')
      const newPwd = jwt.verify(jwtNewPwd, JWT_AUTH_ENV)
      if (typeof newPwd === 'string') throw new UserBadRequest('Invalid credentials')

      await model.password.update(newPwd.account, newPwd.pwd)
      res.clearCookie('newPwd')
      return true
    }
  },
  invitation: {
    get: async function (req: Request, res: Response): Promise<IUserInvitation[] | null | undefined> {
      const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV)
      const result = await model.invitation.get(accessToken._id)
      return result
    },
    create: async function (req: Request, res: Response): Promise<boolean> {
      // req.body = account(to Invite), role, _id(group), color(group), name(group)
      const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV)
      if (accessToken.account === req.body.account) throw new Forbidden('Access denied', 'You can not invite yourself to one group')

      const { account, role, _id, color, name } = await validator.user.invitation.create(req.body)
      const { fullName } = await model.get(req.body.account, { fullName: 1 })

      return await model.invitation.create(
        { account, fullName, role },
        { _id, color, name },
        accessToken.account
      )
    },
    accept: async function (req: Request, res: Response) {

    }
  },
  group: {
    get: async function (req: Request, res: Response) {

    },
    remove: async function (req: Request, res: Response) {

    }
  }
}

export default functions
