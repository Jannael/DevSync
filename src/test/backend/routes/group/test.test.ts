import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import userModel from './../../../../backend/model/user/model'
import userDbModel from './../../../../backend/database/schemas/node/user'
import groupDbModel from './../../../../backend/database/schemas/node/group'
import { IGroup } from '../../../../backend/interface/group'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'>

let app: Express
let agent: ReturnType<typeof request.agent>
let secondAgent: ReturnType<typeof request.agent>
let group: IGroup

beforeAll(async () => {
  app = await createApp(DB_URL_ENV_TEST)
  agent = await request.agent(app)
  secondAgent = await request.agent(app)

  // get two agents tokens
  await userModel.create({
    fullName: 'test',
    account: 'firstUser@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })
  await userModel.create({
    fullName: 'test',
    account: 'secondUser@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })

  await agent
    .post('/auth/v1/request/refreshToken/code/')
    .send({
      account: 'firstUser@gmail.com',
      pwd: 'test',
      TEST_PWD: TEST_PWD_ENV
    })
  await agent
    .post('/auth/v1/request/refreshToken/')
    .send({
      code: '1234'
    })

  await secondAgent
    .post('/auth/v1/request/refreshToken/code/')
    .send({
      account: 'secondUser@gmail.com',
      pwd: 'test',
      TEST_PWD: TEST_PWD_ENV
    })
  await secondAgent
    .post('/auth/v1/request/refreshToken/')
    .send({
      code: '1234'
    })
})

afterAll(async () => {
  await groupDbModel.deleteMany({})
  await userDbModel.deleteMany({})
  await mongoose.connection.close()
})

describe('/group/v1/', () => {
  const path = '/group/v1'
  describe('/create/', () => {
    const endpoint = path + '/create/'
    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          name: 'firstGroup',
          color: '#000000',
          techLead: ['secondUser@gmail.com']
        })

      group = res.body.result

      expect(res.body).toStrictEqual({
        complete: true,
        result: {
          name: 'firstGroup',
          color: '#000000',
          _id: expect.any(String)
        }
      })
    })
    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            return await agent
              .post(endpoint)
          },
          error: {
            code: 400,
            complete: false,
            msg: 'Missing data',
            description: 'You need to send at least the name and color for the group you want to create'
          }
        }
      ]

      for (const { fn, error } of cases) {
        const res = await fn()
        expect(res.statusCode).toEqual(error.code)
        expect(res.body.complete).toEqual(error.complete)
        expect(res.body.msg).toEqual(error.msg)
        expect(res.body.description).toEqual(error.description)
      }
    })
  })

  describe('/get/', () => {
    const endpoint = path + '/get/'
    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          _id: group._id
        })

      expect(res.body.complete).toEqual(true)
      expect(res.body.result).toStrictEqual({
        _id: expect.any(String),
        techLead: [
          { fullName: 'test', account: 'secondUser@gmail.com' },
          { fullName: 'test', account: 'firstUser@gmail.com' }
        ],
        name: 'firstGroup',
        color: '#000000',
        member: []
      })
    })

    test('error', async () => {
      // const cases = [
      //   {
      //     fn: async function () {
      //     }
      //   }
      // ]
      //       for (const { fn, error } of cases) {
      //   const res = await fn()
      //   expect(res.statusCode).toEqual(error.code)
      //   expect(res.body.complete).toEqual(error.complete)
      //   expect(res.body.msg).toEqual(error.msg)
      //   expect(res.body.description).toEqual(error.description)
      // }
    })
  })

  describe('/update/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/member/update/role/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/member/remove/', () => {
    test('', async () => {})
    test('error', async () => {})
  })

  describe('/delete/', () => {
    test('', async () => {})
    test('error', async () => {})
  })
})
