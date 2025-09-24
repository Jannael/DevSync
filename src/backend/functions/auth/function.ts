import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { generateCode, sendEmail } from '../../utils/utils'
import dotenv from 'dotenv'

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
    }
  }

}

export default functions
