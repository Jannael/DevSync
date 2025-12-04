import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import userModel from './../../../../backend/model/user/model'
import userDbModel from './../../../../backend/database/schemas/node/user'
import groupDbModel from './../../../../backend/database/schemas/node/group'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'>

let app: Express
let agent: ReturnType<typeof request.agent>
let secondAgent: ReturnType<typeof request.agent>

beforeAll(async () => {
  app = await createApp(DB_URL_ENV_TEST)

  // get two agents tokens
  await userModel.create({
    fullName: 'test',
    account: 'firstUser@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })

  await userModel.create({
    fullName: 'test',
    account: 'secondUser@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })

  agent = await request.agent(app)
  secondAgent = await request.agent(app)

  await agent
    .post('/auth/v1/request/refreshToken/code/')
    .send({
      account: 'firstUser@gmail.com',
      pwd: 'test',
      TEST_PWD: TEST_PWD_ENV
    })

  await agent
    .post('/auth/v1/request/refreshToken/')
    .send({
      code: '1234'
    })

  await secondAgent
    .post('/auth/v1/request/refreshToken/code/')
    .send({
      account: 'secondUser@gmail.com',
      pwd: 'test',
      TEST_PWD: TEST_PWD_ENV
    })

  await secondAgent
    .post('/auth/v1/request/refreshToken/')
    .send({
      code: '1234'
    })
})

afterAll(async () => {
  await groupDbModel.deleteMany({})
  await userDbModel.deleteMany({})
  await mongoose.connection.close()
})

describe('/group/v1/', () => {
  describe('/create/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/get/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/update/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/member/update/role/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/member/remove/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/delete/', () => {
    test('', async () => {})
    test('error', async () => {})
  })
})
