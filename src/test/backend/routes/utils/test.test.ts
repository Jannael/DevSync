import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import { Server } from 'node:http'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

afterAll(async () => {
  await mongoose.connection.close()
})

describe('auth router', () => {
  let app: Express
  let server: Server

  beforeAll(async () => {
    app = await createApp(DB_URL_ENV_TEST)
    server = app.listen(3000)
  })

  afterAll(async () => {
    server.close()
  })

  describe('utils', () => {
    test('health checker', async () => {
      const res = await request(server).get('/utils/v1/healthChecker/')
      expect(res.body).toStrictEqual({ ok: 1 })
    })
  })
})
