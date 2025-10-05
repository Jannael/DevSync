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
  agent = request.agent(app)
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
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            return await agent.post('/auth/v1/request/code')
              .send({
                account: 'test'
              })
          },
          error: { code: 400, msg: 'Missing or invalid account', complete: false }
        },
        {
          fn: async function () {
            return await agent.post('/auth/v1/request/code')
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
})
