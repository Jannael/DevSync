import { Request } from 'express'
import dotenv from 'dotenv'
import { decrypt } from './utils'
import { IEnv } from '../interface/env'
import { UserBadRequest } from '../error/error'
import jwt from 'jsonwebtoken'

dotenv.config({ quiet: true })
const {
  CRYPTO_ACCESS_TOKEN_ENV,
  JWT_ACCESS_TOKEN_ENV

} = process.env as Pick<IEnv,
'CRYPTO_ACCESS_TOKEN_ENV' |
'JWT_ACCESS_TOKEN_ENV'
>

async function getAccessToken (req: Request): Promise<void> {
  if (req.cookies.accessToken === undefined) throw new UserBadRequest('Invalid credentials', 'Missing accessToken')
  const jwtAccessToken = decrypt(req.cookies.accessToken, CRYPTO_ACCESS_TOKEN_ENV, 'accessToken')
  const accessToken = jwt.verify(jwtAccessToken, JWT_ACCESS_TOKEN_ENV)
  if (typeof accessToken === 'string') throw new UserBadRequest('Invalid credentials', 'Invalid accessToken')
  req.body.accessToken = accessToken
}

export default getAccessToken
