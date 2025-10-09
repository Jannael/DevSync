/***
  User's CRUD
***/

import { IRefreshToken, IUser } from '../../interface/user'
import model from './../../model/user/model'
import validator from '../../validator/validator'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import config from './../../config/config'
import { UserBadRequest } from '../../error/error'
import { IEnv } from '../../interface/env'

dotenv.config({ quiet: true })
const { JWT_ACCESS_TOKEN_ENV, JWT_REFRESH_TOKEN_ENV, JWT_AUTH_ENV } = process.env as Pick<IEnv,
'JWT_ACCESS_TOKEN_ENV' |
'JWT_REFRESH_TOKEN_ENV' |
'JWT_AUTH_ENV'>

const functions = {
  user: {
    get: async function (req: Request, res: Response) {
      if (req.cookies.accessToken === undefined) throw new UserBadRequest('Missing accessToken')

      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV)

      if (typeof accessToken === 'string') throw new UserBadRequest('Invalid accessToken')

      delete accessToken.iat
      delete accessToken.exp
      delete accessToken._id

      return accessToken
    },
    create: async function (req: Request, res: Response): Promise<Partial<IRefreshToken>> {
      if (req.cookies?.account === undefined || req.body === undefined) throw new UserBadRequest('Account not verified')

      const decoded = jwt.verify(req.cookies?.account, JWT_AUTH_ENV)
      if (typeof decoded === 'string') throw new UserBadRequest('Account not verified')
      if (decoded.account !== req.body.account) throw new UserBadRequest('Verified account does not match the sent account')

      req.body.account = decoded.account

      const validData = validator.user.create(req.body)
      if (validData === null) throw new UserBadRequest('Invalid or missing data, the user must match the following rules, pwd-length>=6, account(unique cant be two users with the same account): example@service.com, nickName-length>=3, personalization: {theme: \'\'}, role: ["documenter" or "techLead" or "developer"]')

      const result = await model.user.create(validData)

      const refreshToken = jwt.sign(result, JWT_REFRESH_TOKEN_ENV, config.jwt.refreshToken as SignOptions)
      const accessToken = jwt.sign(result, JWT_ACCESS_TOKEN_ENV, config.jwt.accessToken as SignOptions)

      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)

      delete (result as IUser)._id

      return result
    },
    update: async function (req: Request, res: Response) {
      if (req.body.account !== undefined ||
        req.body.refreshToken !== undefined ||
        req.body._id !== undefined ||
        req.cookies.account === undefined ||
        req.cookies.accessToken === undefined
      ) throw new UserBadRequest('Not authorized')

      const accountCookie = jwt.verify(req.cookies.account, JWT_AUTH_ENV)
      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV)

      if (typeof accountCookie === 'string' ||
        typeof accessToken === 'string'
      ) throw new UserBadRequest('Account not verified')

      if (accessToken.account !== accountCookie.account) throw new UserBadRequest('Forbidden')

      const data = validator.user.partial(req.body)
      if (data === null) throw new UserBadRequest('No data to update or invalid data')

      const result = await model.user.update(data, accessToken._id)
      return result
    },
    delete: async function (req: Request, res: Response) {
      if (req.cookies.account === undefined ||
        req.cookies.accessToken === undefined
      ) throw new UserBadRequest('Account not verified')

      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV) as JwtPayload
      const cookieAccount = jwt.verify(req.cookies.account, JWT_AUTH_ENV) as JwtPayload

      if (typeof accessToken === 'string' ||
        typeof cookieAccount === 'string'
      ) throw new UserBadRequest('Not authorized')

      if (accessToken.account !== cookieAccount.account) throw new UserBadRequest('Forbidden')

      return await model.user.delete(accessToken._id)
    },
    account: {
      update: async function (req: Request, res: Response): Promise<IRefreshToken> {
        if (req.cookies.accessToken === undefined ||
          req.cookies.newAccount_account === undefined
        ) throw new UserBadRequest('Not authorized')

        const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESS_TOKEN_ENV)
        const newAccount = jwt.verify(req.cookies.newAccount_account, JWT_AUTH_ENV) as string

        if (typeof accessToken === 'string' ||
          typeof newAccount === 'string'
        ) throw new UserBadRequest('Forbidden')

        const response = await model.user.account.update(accessToken._id, newAccount)

        return response
      }
    }
  }
}

export default functions
