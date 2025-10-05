import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'

dotenv.config({ quiet: true })
const { TEST_PWD_ENV } = process.env as Pick<IEnv, 'TEST_PWD_ENV'>

let app: Express
let agent: ReturnType<typeof request.agent>

beforeAll(async () => {
  app = await createApp()
  agent = await request.agent(app)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('auth router', () => {
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
})
