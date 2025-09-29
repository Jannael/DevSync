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
      const accessToken = jwt.verify(req.cookies.accessToken, JWT_ACCESSTOKEN_ENV)
      return accessToken
    },
    create: async function (req: Request, res: Response): Promise<IUser | Error> {
      const data = req.body
      const token = req.cookies?.email
      if (token === undefined || token === null) throw new UserBadRequest('email not verified')

      const decoded = jwt.verify(token, JWT_AUTH_ENV) as JwtPayload
      if (typeof decoded === 'string') throw new UserBadRequest('email not verified')

      req.body.email = decoded.email

      const validData = validator.user.create(data)
      if (validData === null) { throw new UserBadRequest('invalid or missing data') }

      const result = await model.user.create(data)

      const refreshToken = jwt.sign(result, JWT_REFRESHTOKEN_ENV, config.jwt.refreshToken as SignOptions)
      const accessToken = jwt.sign(result, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)

      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', accessToken, config.cookies.accessToken)

      return result
    }
  }
}

export default functions
