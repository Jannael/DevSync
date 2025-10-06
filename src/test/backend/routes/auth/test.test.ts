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

describe('auth router', () => {
  const path = '/auth/v1'

  describe('/request/code/', () => {
    test('', async () => {
      const res = await agent
        .post('/auth/v1/request/code')
        .send({
          account: 'test@gmail.com',
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.headers['set-cookie'][0]).toMatch(/code=.* HttpOnly$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await request(app).post('/auth/v1/request/code')
              .send({
                account: 'test'
              })
          },
          error: { code: 400, msg: 'Missing or invalid account', complete: false }
        },
        {
          fn: async function () {
            return await request(app).post('/auth/v1/request/code')
          },
          error: { code: 400, msg: 'Missing or invalid account', complete: false }
        }
      ]

      for (const { fn, error } of func) {
        const res = await fn()
        expect(res.statusCode).toEqual(error.code)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.msg).toEqual(error.msg)
      }
    })
  })

  describe('/verify/code/', () => {
    const endpoint = '/auth/v1/verify/code'

    test('', async () => {
      const res = await agent
        .post('/auth/v1/verify/code')
        .send({
          account: 'test@gmail.com',
          code: '1234'
        })

      expect(res.headers['set-cookie'][0]).toMatch(/code=.*GMT$/)
      expect(res.headers['set-cookie'][1]).toMatch(/account=.* HttpOnly$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
          },
          error: { code: 400, msg: 'Missing code', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                code: '1234'
              })
          },
          error: { code: 400, msg: 'Missing code', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .set('Cookie', ['code=unknown'])
              .send({
                code: '1234'
              })
          },
          error: { code: 400, msg: 'Invalid token', complete: false }
        },
        {
          fn: async function () {
            const agent = request.agent(app)
            // first ask for the code
            await agent
              .post('/auth/v1/request/code')
              .send({
                account: 'test@gmail.com',
                TEST_PWD: TEST_PWD_ENV
              })

            return await agent
              .post(endpoint)
              .send({
                code: '123'
              })
          },
          error: { code: 400, msg: 'Wrong code', complete: false }
        },
        {
          fn: async function () {
            const agent = request.agent(app)
            // first ask for the code
            await agent
              .post('/auth/v1/request/code')
              .send({
                account: 'test@gmail.com',
                TEST_PWD: TEST_PWD_ENV
              })

            return await agent
              .post(endpoint)
              .send({
                account: 'test',
                code: '1234'
              })
          },
          error: { code: 400, msg: 'You tried to change the account now your banned forever', complete: false }
        }
      ]

      for (const { fn, error } of func) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
      }
    })
  })

  describe('/request/refreshToken/code', () => {
    const endpoint = path + '/request/refreshToken/code/'

    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          account: user.account,
          pwd: 'test',
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.headers['set-cookie'][0]).toMatch(/token=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/code=.*HttpOnly$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test'
              })
          },
          error: { complete: false, msg: 'Missing data', code: 400 }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test@gmail.com'
              })
          },
          error: { complete: false, msg: 'Missing data', code: 400 }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test',
                pwd: ''
              })
          },
          error: { complete: false, msg: 'Missing data', code: 400 }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test@example.com',
                pwd: ''
              })
          },
          error: { complete: false, msg: 'User not found', code: 404 }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: user.account,
                pwd: '1234'
              })
          },
          error: { complete: false, msg: 'Incorrect password', code: 400 }
        }
      ]

      for (const { fn, error } of func) {
        const res = await fn()
        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
      }
    })
  })

  describe('/request/refreshToken/', () => {
    const endpoint = path + '/request/refreshToken'

    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          code: '1234'
        })

      expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/accessToken=.*HttpOnly$/)
      expect(res.headers['set-cookie'][2]).toMatch(/token=.*GMT$/)
      expect(res.headers['set-cookie'][3]).toMatch(/code=.*GMT$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                code: '1234'
              })
          },
          error: { code: 400, msg: 'You need to use MFA for login', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .set('Cookie', ['code=unknown'])
              .set('Cookie', ['token=unknown'])
          },
          error: { code: 400, msg: 'You need to use MFA for login', complete: false }
        }
      ]

      for (const { fn, error } of func) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
      }
    })
  })

  describe('/request/accessToken/', () => {
    const endpoint = path + '/request/accessToken/'
    test('', async () => {
      const res = await agent
        .get(endpoint)

      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {

    })
  })

  describe('/account/request/code/', () => {
    const endpoint = path + '/account/request/code/'
    test('', async () => {
      const res = await agent
        .patch(endpoint)
        .send({
          newAccount: 'test1@gmail.com',
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.body).toEqual({ complete: true })
      expect(res.headers['set-cookie'][0]).toMatch(/account=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/newAccount=.*HttpOnly$/)
    })
    test('error', async () => {})
  })

  describe('/account/verify/code/', () => {
    const endpoint = path + '/account/verify/code/'
    test('', async () => {
      const res = await agent
        .patch(endpoint)
        .send({
          codeCurrentAccount: '1234',
          codeNewAccount: '1234'
        })

      expect(res.body).toEqual({ complete: true })
      expect(res.headers['set-cookie'][0]).toMatch(/account=.*GMT$/)
      expect(res.headers['set-cookie'][1]).toMatch(/newAccount=.*GMT$/)
      expect(res.headers['set-cookie'][2]).toMatch(/newAccount_account=.*HttpOnly$/)
    })

    test('error', async () => {})
  })
})
