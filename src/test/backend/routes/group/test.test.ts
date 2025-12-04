import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import userModel from './../../../../backend/model/user/model'
import userDbModel from './../../../../backend/database/schemas/node/user'
import groupDbModel from './../../../../backend/database/schemas/node/group'
import { IRefreshToken } from '../../../../backend/interface/user'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

let app: Express
beforeAll(async () => {
  app = await createApp(DB_URL_ENV_TEST)
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
