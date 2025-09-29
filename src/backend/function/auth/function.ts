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
import { DatabaseError, UserBadRequest } from '../../error/error'

dotenv.config({ quiet: true })
const { JWT_ACCESSTOKEN_ENV, JWT_REFRESHTOKEN_ENV, JWT_AUTH_ENV } = process.env as Pick<IEnv,
'JWT_ACCESSTOKEN_ENV' |
'JWT_REFRESHTOKEN_ENV' |
'JWT_AUTH_ENV'>
const { ObjectId } = Schema.Types

const functions = {
  request: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean, error?: Error }> {
      try {
        const code = generateCode()
        await sendEmail(req.body.email, code)

        const codeHash = jwt.sign({ code }, JWT_AUTH_ENV, config.jwt.code as SignOptions)
        res.cookie('code', codeHash, config.cookies.code)
        return { complete: true }
      } catch (error) {
        if (error instanceof Error) return { complete: false, error }
        return { complete: false }
      }
    },
    accessToken: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      if (req.cookies.refreshToken === undefined) throw new UserBadRequest('You need to login')

      try {
        const refreshToken = jwt.verify(req.cookies.refreshToken, JWT_REFRESHTOKEN_ENV) as IUser
        const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken, refreshToken._id as typeof ObjectId)
        if (!dbValidation) { return { complete: false } }

        const accessToken = jwt.sign(refreshToken, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)
        res.cookie('accessToken', accessToken, config.cookies.accessToken)
        return { complete: true }
      } catch (e) {
        return { complete: false }
      }
    },
    refreshToken: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      const user = (await model.verify.login(req.body.account, req.body.pwd))

      const refreshToken = jwt.sign(user, JWT_REFRESHTOKEN_ENV, config.jwt.refreshToken as SignOptions)
      const acccessToken = jwt.sign(user, JWT_ACCESSTOKEN_ENV, config.jwt.accessToken as SignOptions)

      const saveRefreshToken = await model.auth.refreshToken.save(refreshToken, user._id as typeof ObjectId)
      if (!saveRefreshToken) { throw new DatabaseError('something went wrong please try again') }

      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      res.cookie('accessToken', acccessToken, config.cookies.accessToken)

      return { complete: true }
    }
  },
  verify: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      const { code } = jwt.verify(req.cookies.code, JWT_AUTH_ENV) as JwtPayload
      if (req.body.code !== code) throw new UserBadRequest('wrong code')

      const emailHash = jwt.sign(req.body.email, JWT_AUTH_ENV, config.jwt.code as SignOptions)
      res.cookie('email', emailHash, config.cookies.code)
      return { complete: true }
    }
  }
}

export default functions
