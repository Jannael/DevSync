import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import { Server } from 'node:http'

describe('auth router', () => {
  let app: Express
  let server: Server

  beforeAll(async () => {
    app = await createApp()
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

  describe('request/code', () => {
    test('', async () => {

    })

    test('error', async () => {

    })
  })
})
