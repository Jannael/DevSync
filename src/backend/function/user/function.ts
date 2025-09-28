import { IUser } from '../../interface/user'
import model from './../../model/user/model'
import validator from '../../validator/validator'
import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import config from './../../config/config'
import { UserBadRequest } from '../../error/error'

dotenv.config({ quiet: true })
const { JWT_ENV } = process.env as { JWT_ENV: string }

const functions = {
  user: {
    create: async function (req: Request, res: Response): Promise<IUser | Error> {
      const data = req.body

      const validData = validator.user.create(data)
      if (validData === null) { throw new UserBadRequest('invalid or missing data') }

      const result = await model.create.user(data)

      const refreshToken = jwt.sign(result, JWT_ENV, config.jwt.refreshToken as SignOptions)
      res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
      return result
    }

  }
}

export default functions
