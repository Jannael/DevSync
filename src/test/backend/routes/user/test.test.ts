import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import userModel from './../../../../backend/model/user/model'
import { IRefreshToken } from '../../../../backend/interface/user'

dotenv.config({ quiet: true })
const { TEST_PWD_ENV } = process.env as unknown as IEnv

let app: Express
let agent: ReturnType<typeof request.agent>
let user: IRefreshToken

beforeAll(async () => {
  app = await createApp()
  agent = await request.agent(app)

  user = await userModel.user.create({
    fullName: 'test',
    account: 'test@gmail.com',
    pwd: 'test',
    role: ['documenter'],
    nickName: 'test',
    personalization: { theme: 'test' }
  })
})

afterAll(async () => {
  await userModel.user.delete(user._id)
  await mongoose.connection.close()
})

describe('/user/v1/', () => {
  beforeAll(async () => {
    await agent
      .post('/auth/v1/request/refreshToken/code/')
      .send({
        account: user.account,
        pwd: 'test',
        TEST_PWD: TEST_PWD_ENV
      })
    await agent
      .post('/auth/v1/request/refreshToken/')
      .send({
        code: '1234'
      })
  })
})
