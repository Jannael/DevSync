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
import { IRefreshToken } from '../../interface/user'

dotenv.config({ quiet: true })
const { JWT_ENV } = process.env as { JWT_ENV: string }

const functions = {
  request: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean, error?: Error }> {
      try {
        const code = generateCode()
        await sendEmail(req.body.email, code)

        const codeHash = jwt.sign({ code }, JWT_ENV, config.jwt.code as SignOptions)
        res.cookie('code', codeHash, config.cookies.code)
        return { complete: true }
      } catch (error) {
        if (error instanceof Error) return { complete: false, error }
        return { complete: false }
      }
    },
    accessToken: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      try {
        const refreshToken = jwt.verify(req.cookies.refreshToken, JWT_ENV) as IRefreshToken
        const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken, refreshToken.userId)
        if (!dbValidation) { return { complete: false } }

        const accessToken = jwt.sign(refreshToken, JWT_ENV, config.jwt.accessToken as SignOptions)
        res.cookie('accessToken', accessToken, config.cookies.accessToken)
        return { complete: true }
      } catch (e) {
        return { complete: false }
      }
    }
  },
  verify: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean }> {
      try {
        const { code } = jwt.verify(req.cookies.code, JWT_ENV) as JwtPayload
        if (req.body.code !== code) { return { complete: false } }

        const emailHash = jwt.sign(req.body.email, JWT_ENV, config.jwt.code as SignOptions)
        res.cookie('email', emailHash, config.cookies.code)
        return { complete: true }
      } catch (e) {
        return { complete: false }
      }
    }
  }

}

export default functions
