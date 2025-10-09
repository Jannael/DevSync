import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import userModel from './../../../../backend/model/user/model'
import { IRefreshToken } from '../../../../backend/interface/user'
import dbModel from './../../../../backend/database/schemas/node/user'

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
  await dbModel.deleteMany({})
  await mongoose.connection.close()
})

describe('/user/v1/', () => {
  const path = '/user/v1'
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

  describe('/get/', () => {
    const endpoint = path + '/get/'
    test('', async () => {
      const res = await agent
        .get(endpoint)

      expect(res.body).toStrictEqual({
        fullName: 'test',
        account: 'test@gmail.com',
        role: ['documenter'],
        nickName: 'test',
        personalization: { theme: 'test' }
      })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await request(app)
              .get(endpoint)
          },
          error: { code: 400, msg: 'Missing accessToken', complete: false }
        }
      ]

      for (const { fn, error } of func) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.link).toEqual([
          { rel: 'get accessToken', href: '/auth/v1/request/accessToken/' }
        ])
      }
    })
  })

  describe('/create/', () => {
    const endpoint = path + '/create/'
    test('', async () => {
      const agent = request.agent(app)

      await agent
        .post('/auth/v1/request/code/')
        .send({
          account: 'create@gmail.com',
          TEST_PWD: TEST_PWD_ENV
        })

      await agent
        .post('/auth/v1/verify/code')
        .send({
          account: 'create@gmail.com',
          code: '1234'
        })

      const res = await agent
        .post(endpoint)
        .send({
          fullName: 'test',
          account: 'create@gmail.com',
          pwd: '123456',
          role: ['documenter'],
          nickName: 'test',
          personalization: { theme: 'test' }
        })

      expect(res.body).toStrictEqual({
        fullName: 'test',
        account: 'create@gmail.com',
        role: ['documenter'],
        nickName: 'test',
        personalization: { theme: 'test' }
      })

      expect(res.statusCode).toEqual(201)
    })

    test('error', () => {
      
    })
  })
})
