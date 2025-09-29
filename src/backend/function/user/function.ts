/***
  User's CRUD
***/

import { IUser } from '../../interface/user'
import model from './../../model/user/model'
import validator from '../../validator/validator'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import config from './../../config/config'
import { UserBadRequest } from '../../error/error'
import { IEnv } from '../../interface/env'

dotenv.config({ quiet: true })
const { JWT_ACCESSTOKEN_ENV, JWT_REFRESHTOKEN_ENV, JWT_AUTH_ENV } = process.env as Pick<IEnv,
'JWT_ACCESSTOKEN_ENV' |
'JWT_REFRESHTOKEN_ENV' |
'JWT_AUTH_ENV'>

const functions = {
  user: {
    get: async function (req: Request, res: Response) {
      if (req.cookies.accessToken === undefined) throw new UserBadRequest('missing accessToken')

      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESSTOKEN_ENV)

      if (typeof accessToken === 'string') throw new UserBadRequest('invalid accessToken')

      return accessToken
    },
    create: async function (req: Request, res: Response): Promise<Pick<IUser, 'fullName' | 'account' | 'nickName' | 'role' | 'personalization'> | Error> {
      const data = req.body
      const token = req.cookies?.account
      if (token === undefined || token === null) throw new UserBadRequest('Account not verified')

      const decoded = jwt.verify(token, JWT_AUTH_ENV) as JwtPayload
      if (typeof decoded === 'string') throw new UserBadRequest('Account not verified')

      req.body.account = decoded.account

      const validData = validator.user.create(data)
      if (validData === null) { throw new UserBadRequest('invalid or missing data') }

      const result = await model.user.create(data)

      const refreshToken = jwt.sign(result, JWT_REFRESHTOKEN_ENV, config.jwt.refreshToken as SignOptions)
      const accessToken = jwt.sign(result, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)

      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)

      return result
    },
    update: async function (req: Request, res: Response) {
      if (req.body.account !== undefined) throw new UserBadRequest('Not authorized')
      if (req.cookies.account === undefined) throw new UserBadRequest('Account not verified')
      if (req.cookies.acccessToken === undefined) throw new UserBadRequest('Account not verified')
      const decoded = jwt.verify(req.cookies.account, JWT_AUTH_ENV)
      if (typeof decoded === 'string') throw new UserBadRequest('Account not verified')
      const accessToken = jwt.verify(req.cookies.acccessToken, JWT_ACCESSTOKEN_ENV)
      if (typeof accessToken === 'string') throw new UserBadRequest('Account not verified')

      req.body = decoded.account

      const data = validator.user.partial(req.body)
      if (data === null) throw new UserBadRequest('no data to update')

      const result = await model.user.update(data, accessToken._id)
      return result
    },
    delete: async function (req: Request, res: Response) {
      if (req.cookies.account === undefined) throw new UserBadRequest('account not verifed')
      if (req.cookies.accessToken === undefined) throw new UserBadRequest('Account not verified')
      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESSTOKEN_ENV) as JwtPayload
      if (typeof accessToken === 'string') throw new UserBadRequest('Not authorized')
      const cookieAccount = jwt.verify(req.cookies.account, JWT_AUTH_ENV) as JwtPayload
      if (typeof cookieAccount === 'string') throw new UserBadRequest('Account not verified')

      if (accessToken.account !== cookieAccount.account) throw new UserBadRequest('Forbidden')

      return await model.user.delete(accessToken._id)
    }
  }
}

export default functions
