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
})
