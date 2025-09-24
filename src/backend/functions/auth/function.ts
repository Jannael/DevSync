import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { generateCode, sendEmail } from '../../utils/utils'
import dotenv from 'dotenv'
import model from '../../model/auth/model'

dotenv.config({ quiet: true })
const { JWT_ENV } = process.env

const functions = {
  request: {
    code: async function (req: Request, res: Response): Promise<{ complete: boolean, error?: Error }> {
      try {
        const code = generateCode()
        await sendEmail(req.body.email, code)

        const codeHash = jwt.sign({ code }, JWT_ENV as string, { expiresIn: '5m' })
        res.cookie('code', codeHash, { httpOnly: true, maxAge: 60 * 5 })
        return { complete: true }
      } catch (error) {
        if (error instanceof Error) return { complete: false, error }
        return { complete: false }
      }
    },
    accessToken: async function (req: Request, res: Response): Promise<void> {
      try {
        const dbValidation = await model.verify.refreshToken(req.cookies.refreshToken)
        if (dbValidation) {
          const refreshToken = jwt.verify(req.cookies.refreshToken, JWT_ENV as string)
          const accessToken = jwt.sign(refreshToken, JWT_ENV as string, { expiresIn: '15m' })
          res.cookie('accessToken', accessToken, {})
        }
      } catch (e) {

      }
    }
  }

}

export default functions
