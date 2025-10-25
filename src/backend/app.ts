import express from 'express'
import cookieParser from 'cookie-parser'
import router from './../backend/routes/merge'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from './interface/env'
import middleware from './middleware/merge'
import rateLimit from 'express-rate-limit'

dotenv.config({ quiet: true })

const { DB_URL_ENV } = process.env as Pick<IEnv, 'DB_URL_ENV'>

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many request',
  headers: true
})

export async function createApp (): Promise<express.Express> {
  await mongoose.connect(DB_URL_ENV)
    .then(() => console.log('connected to mongoose'))
    .catch(e => console.error('something went wrong connecting to mongoose', e))

  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.use(limiter)
  app.use(middleware.header)

  app.use('/auth/v1/', router.auth)
  app.use('/user/v1/', router.user)
  app.use('/utils/v1/', router.utils)

  return app
}
