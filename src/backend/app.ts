import express from 'express'
import cookieParser from 'cookie-parser'
import router from './../backend/routes/merge'
import mongoose from 'mongoose'
import middleware from './middleware/merge'

export async function createApp (dbEnv: string): Promise<express.Express> {
  await mongoose.connect(dbEnv)
    .then(() => console.log('connected to mongoose'))
    .catch(e => console.error('something went wrong connecting to mongoose', e))

  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.use(middleware.header)

  app.use('/auth/v1/', router.auth)
  app.use('/user/v1/', router.user)
  app.use('/utils/v1/', router.utils)
  app.use('/group/v1/', router.group)

  return app
}
