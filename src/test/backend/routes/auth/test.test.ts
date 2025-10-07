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

describe('/auth/v1/', () => {
  const path = '/auth/v1'

  describe('/request/code/', () => {
    test('', async () => {
      const res = await agent
        .post('/auth/v1/request/code/')
        .send({
          account: 'test@gmail.com',
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.headers['set-cookie'][0]).toMatch(/code=.* HttpOnly$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app).post('/auth/v1/request/code')
              .send({
                account: 'test'
              })
          },
          error: { code: 400, msg: 'Missing or invalid account, the account must match the following pattern example@service.ext', complete: false }
        },
        {
          fn: async function () {
            return await request(app).post('/auth/v1/request/code')
          },
          error: { code: 400, msg: 'Missing or invalid account, the account must match the following pattern example@service.ext', complete: false }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()
        expect(res.statusCode).toEqual(error.code)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.msg).toEqual(error.msg)
      }
    })
  })

  describe('/verify/code/', () => {
    const endpoint = '/auth/v1/verify/code/'

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
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
          },
          error: {
            code: 400,
            msg: 'Missing code',
            complete: false,
            link: [
              { rel: 'Missing code', href: '/auth/v1/request/code' }
            ]
          }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                code: '1234'
              })
          },
          error: {
            code: 400,
            msg: 'Missing code',
            complete: false,
            link: [
              { rel: 'Missing code', href: '/auth/v1/request/code' }
            ]
          }
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

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        if (error.link !== undefined) {
          expect(res.body.link).toEqual(expect.arrayContaining(error.link))
        }
      }
    })
  })

  describe('/request/refreshToken/code/', () => {
    const endpoint = path + '/request/refreshToken/code/'

    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          account: user.account,
          pwd: 'test',
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.headers['set-cookie'][0]).toMatch(/tokenR=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/codeR=.*HttpOnly$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test'
              })
          },
          error: { complete: false, msg: 'Missing or invalid data the account must match the following pattern example@service.ext', code: 400 }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                account: 'test@gmail.com'
              })
          },
          error: { complete: false, msg: 'Missing or invalid data the account must match the following pattern example@service.ext', code: 400 }
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
          error: { complete: false, msg: 'Missing or invalid data the account must match the following pattern example@service.ext', code: 400 }
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

      for (const { fn, error } of cases) {
        const res = await fn()
        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
      }
    })
  })

  describe('/request/refreshToken/', () => {
    const endpoint = path + '/request/refreshToken/'

    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          code: '1234'
        })

      expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/accessToken=.*HttpOnly$/)
      expect(res.headers['set-cookie'][2]).toMatch(/tokenR=.*GMT$/)
      expect(res.headers['set-cookie'][3]).toMatch(/codeR=.*GMT$/)
      expect(res.body).toEqual({ complete: true })
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .send({
                code: '1234'
              })
          },
          error: {
            code: 400,
            msg: 'You need to use MFA for login',
            complete: false,
            link: [
              { rel: 'You need to use MFA for login', href: '/auth/v1/request/refreshToken/code/' }
            ]
          }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .set('Cookie', ['codeR=unknown', 'tokenR=unknown'])
          },
          error: {
            code: 400,
            msg: 'You need to use MFA for login',
            complete: false,
            link: [
              { rel: 'You need to use MFA for login', href: '/auth/v1/request/refreshToken/code/' }
            ]
          }
        },
        {
          fn: async function () {
            return await request(app)
              .post(endpoint)
              .set('Cookie', ['codeR=unknown', 'tokenR=unknown'])
              .send({
                code: '1234'
              })
          },
          error: { code: 400, msg: 'Invalid token', complete: false }
        },
        {
          fn: async function () {
            await agent
              .post(endpoint + 'code/')
              .send({
                account: user.account,
                pwd: 'test',
                TEST_PWD: TEST_PWD_ENV
              })
            return await agent
              .post(endpoint)
              .send({
                code: '0000'
              })
          },
          error: { code: 400, msg: 'Wrong code', complete: false }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        if (error.link !== undefined) {
          expect(res.body.link).toEqual(expect.arrayContaining(error.link))
        }
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
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .get(endpoint)
          },
          error: {
            code: 400,
            msg: 'You need to login',
            complete: false,
            link: [
              { rel: 'Code for login', href: '' },
              { rel: 'Verify code for login', href: '' }
            ]
          }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        if (error.link !== undefined) {
          expect(res.body.link).toEqual(expect.arrayContaining(error.link))
        }
      }
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
      expect(res.headers['set-cookie'][0]).toMatch(/currentAccount=.*HttpOnly$/)
      expect(res.headers['set-cookie'][1]).toMatch(/newAccount=.*HttpOnly$/)
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
          },
          error: { code: 401, msg: 'Not authorized', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .set('Cookie', ['accessToken=token'])
          },
          error: { code: 401, msg: 'Not authorized', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .send({
                newAccount: 'account'
              })
          },
          error: { code: 401, msg: 'Not authorized', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .set('Cookie', ['accessToken=token'])
              .send({
                newAccount: 'account'
              })
          },
          error: { code: 401, msg: 'Not authorized', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .set('Cookie', ['accessToken=token'])
              .send({
                newAccount: 'account@gmail.com'
              })
          },
          error: { code: 400, msg: 'Invalid token', complete: false }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.link).toEqual([
          { rel: 'get accessToken with refreshToken', href: '/auth/v1/request/accessToken/' },
          { rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/code' },
          { rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/' }
        ])
      }
    })
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
      expect(res.headers['set-cookie'][0]).toMatch(/currentAccount=.*GMT$/)
      expect(res.headers['set-cookie'][1]).toMatch(/newAccount=.*GMT$/)
      expect(res.headers['set-cookie'][2]).toMatch(/newAccount_account=.*HttpOnly$/)
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .set('Cookie', ['currentAccount=val', 'newAccount=val', 'accessToken=val'])
          },
          error: { code: 400, msg: 'You need to ask for verification codes', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .send({
                codeCurrentAccount: '0000',
                codeNewAccount: '0000'
              })
          },
          error: { code: 400, msg: 'You need to ask for verification codes', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .set('Cookie', ['currentAccount=val', 'newAccount=val', 'accessToken=val'])
              .send({
                codeCurrentAccount: '0000',
                codeNewAccount: '0000'
              })
          },
          error: { code: 400, msg: 'Invalid token', complete: false }
        },
        {
          fn: async function () {
            await agent
              .patch(path + '/account/request/code/')
              .send({
                newAccount: 'test1@gmail.com',
                TEST_PWD: TEST_PWD_ENV
              })

            return await agent
              .patch(endpoint)
              .send({
                codeCurrentAccount: '0000',
                codeNewAccount: '1234'
              })
          },
          error: { code: 400, msg: 'Current account code is wrong', complete: false }
        },
        {
          fn: async function () {
            await agent
              .patch(path + '/account/request/code/')
              .send({
                newAccount: 'test1@gmail.com',
                TEST_PWD: TEST_PWD_ENV
              })

            return await agent
              .patch(endpoint)
              .send({
                codeCurrentAccount: '1234',
                codeNewAccount: '0000'
              })
          },
          error: { code: 400, msg: 'New account code is wrong', complete: false }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.link).toEqual([
          { rel: 'get accessToken with refreshToken', href: '/auth/v1/request/accessToken/' },
          { rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/code' },
          { rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/' },
          { rel: 'get verification code for account change', href: '/auth/v1/account/request/code/' },
          { rel: 'validate code', href: '/auth/v1/account/verify/code/' }
        ])
      }
    })
  })

  describe('/password/request/code/', () => {
    const endpoint = path + '/password/request/code/'
    test('', async () => {
      const res = await request(app)
        .patch(endpoint)
        .send({
          account: user.account,
          TEST_PWD: TEST_PWD_ENV
        })

      expect(res.body).toEqual({ complete: true })
      expect(res.headers['set-cookie'][0]).toMatch(/pwdChange=.*HttpOnly$/)
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .send({
                account: 'test'
              })
          },
          error: { code: 400, msg: 'Missing or invalid account it must match example@service.ext', complete: false }
        },
        {
          fn: async function () {
            return await request(app)
              .patch(endpoint)
              .send({
                account: 'test@service.ext'
              })
          },
          error: { code: 404, msg: 'This user does not exists', complete: false }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()

        expect(res.statusCode).toEqual(error.code)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.complete).toEqual(error.complete)
      }
    })
  })

  describe('/password/verify/code/', () => {
    const endpoint = path + '/password/verify/code/'
    test('', async () => {
      const agent = request.agent(app)
      await agent
        .patch(path + '/password/request/code/')
        .send({
          account: user.account,
          TEST_PWD: TEST_PWD_ENV
        })

      const res = await agent
        .patch(endpoint)
        .send({
          code: '1234',
          account: user.account,
          newPwd: 'insane pwd'
        })
      console.log(res.body)
      expect(res.body.complete).toEqual(true)
    })

    test('error', () => {

    })
  })
})
