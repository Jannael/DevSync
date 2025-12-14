import express from 'express'
import cookieParser from 'cookie-parser'
import router from './../backend/routes/merge'
import mongoose from 'mongoose'
import middleware from './middleware/merge'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { complete: false, msg: 'Too many request' },
  headers: true
})

export async function createApp (dbEnv: string, env: 'production' | 'test'): Promise<express.Express> {
  await mongoose.connect(dbEnv)
    .then(() => console.log('connected to mongoose'))
    .catch(e => console.error('something went wrong connecting to mongoose', e))

  const app = express()

  if (env === 'production') app.use(limiter)

  app.use(express.json())
  app.use(cookieParser())
  app.use(middleware.header)

  app.use('/auth/v1/', router.auth)
  app.use('/user/v1/', router.user)
  app.use('/utils/v1/', router.utils)
  app.use('/group/v1/', router.group)
  app.use('/task/v1/', router.task)
  app.use('/solution/v1/', router.solution)

  return app
}
