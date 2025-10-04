import { createApp } from '../../../../backend/app'
import { Express } from 'express'

let app: Express

beforeAll(async () => {
  app = await createApp()
})

describe('auth router', () => {
  const server = app.listen(3000)

  describe('request/code', () => {
    test('', async () => {

    })

    test('error', async () => {

    })
  })
})
