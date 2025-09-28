import { IUser } from '../../interface/user'
import model from './../../model/user/model'
import validator from '../../validator/validator'
import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import config from './../../config/config'

dotenv.config({ quiet: true })
const { JWT_ENV } = process.env as { JWT_ENV: string }

const functions = {
  create: {
    user: async function (req: Request, res: Response): Promise<IUser | null> {
      const data = req.body

      const validData = validator.user.create(data)
      if (validData === null) { return null }

      const result = await model.create.user(data)
      if (result === null) { return null }

      const refreshToken = jwt.sign(result, JWT_ENV, config.jwt.refreshToken as SignOptions)
      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      return result
    }
  }
}

export default functions
