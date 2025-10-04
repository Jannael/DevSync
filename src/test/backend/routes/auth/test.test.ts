import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'

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
          account: 'test@gmail.com'
        })

      expect(res.headers['set-cookie'][0]).toMatch(/code=.* HttpOnly$/)
    })

    test('error', async () => {

    })
  })
})
