import jwt, { SignOptions } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { generateCode, sendEmail } from './../../utils/utils'
import dotenv from 'dotenv'
import model from './../../model/auth/model'
import config from './../../config/config'

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
        const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken)
        if (dbValidation) {
          const refreshToken = jwt.verify(req.cookies.refreshToken, JWT_ENV)
          const accessToken = jwt.sign(refreshToken, JWT_ENV, config.jwt.accessToken as SignOptions)
          res.cookie('accessToken', accessToken, config.cookies.accessToken)
          return { complete: true }
        }
        return { complete: false }
      } catch (e) {
        return { complete: false }
      }
    }
  }

}

export default functions
