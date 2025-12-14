import { createApp } from '../../../../backend/app'
import { Express } from 'express'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../../../../backend/interface/env'
import { IGroup } from '../../../../backend/interface/group'
import groupModel from '../../../../backend/model/group/model'
import userModel from './../../../../backend/model/user/model'
import { IRefreshToken } from '../../../../backend/interface/user'
import dbUserModel from './../../../../backend/database/schemas/node/user'
import dbGroupModel from './../../../../backend/database/schemas/node/group'
import { ITask } from '../../../../backend/interface/task'
import taskDbModel from './../../../../backend/database/schemas/node/task'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'>

let user: IRefreshToken
let secondUser: IRefreshToken
let group: IGroup
let agent: ReturnType<typeof request.agent>
let app: Express
let secondAgent: ReturnType<typeof request.agent>

beforeAll(async () => {
  app = await createApp(DB_URL_ENV_TEST, 'test')
  agent = await request.agent(app)
  secondAgent = await request.agent(app)
  secondUser = await userModel.create({
    fullName: 'second test',
    account: 'secondUser@gmail.com',
    pwd: 'test',
    nickName: 'second test'
  })

  user = await userModel.create({
    fullName: 'test',
    account: 'test@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })

  group = await groupModel.create({
    name: 'first group',
    color: '#000000',
    member: [{ account: secondUser.account, fullName: secondUser.fullName, role: 'developer' }]
  }, { account: user.account, fullName: user.fullName })

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

  await secondAgent
    .post('/auth/v1/request/refreshToken/code/')
    .send({
      account: secondUser.account,
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
  await taskDbModel.deleteMany({})
  await dbUserModel.deleteMany({})
  await dbGroupModel.deleteMany({})
  await mongoose.connection.close()
})

describe('/task/v1/', () => {
  const path = '/task/v1'
  let task: ITask
  describe('/create/', () => {
    const endpoint = path + '/create/'
    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          groupId: group._id.toString(),
          user: [secondUser.account],
          name: 'task 1',
          priority: 10
        })

      expect(res.body.success).toEqual(true)
      expect(res.body.result).toBeDefined()
      expect(typeof res.body.result).toBe('string')
      expect(mongoose.Types.ObjectId.isValid(res.body.result)).toBe(true)

      const guard = await agent
        .post(path + '/get/')
        .send({ _id: res.body.result, groupId: group._id })

      task = guard.body.result

      expect(guard.body).toStrictEqual({
        success: true,
        result: {
          _id: expect.any(String),
          groupId: expect.any(String),
          user: ['secondUser@gmail.com'],
          name: 'task 1',
          feature: [],
          isComplete: false,
          priority: 10
        }
      })
    })
  })

  describe('/get/', () => {
    test('', async () => {
      const res = await agent
        .post(path + '/get/')
        .send({ _id: task._id, groupId: group._id })

      expect(res.body).toStrictEqual({
        success: true,
        result: {
          _id: expect.any(String),
          groupId: expect.any(String),
          user: ['secondUser@gmail.com'],
          name: 'task 1',
          feature: [],
          isComplete: false,
          priority: 10
        }
      })
    })
  })

  describe('/list/', () => {
    const endpoint = path + '/list/'
    test('', async () => {
      const res = await secondAgent
        .post(endpoint)
        .send({ groupId: group._id, pagination: 0 })
      expect(res.body.success).toBe(true)
      expect(res.body.result).toStrictEqual({
        task: [
          {
            _id: task._id,
            name: 'task 1',
            priority: 10,
            isComplete: false
          }
        ],
        assign: [task._id]
      })
    })
  })

  describe('/update/', () => {
    const endpoint = path + '/update/'
    test('', async () => {
      const res = await agent
        .put(endpoint)
        .send({
          groupId: group._id,
          taskId: task._id,
          data: {
            user: []
          }
        })
      expect(res.body.success).toBe(true)

      const guard = await agent
        .post(path + '/get/')
        .send({ _id: task._id, groupId: group._id })

      expect(guard.body).toStrictEqual({
        success: true,
        result: {
          _id: expect.any(String),
          groupId: expect.any(String),
          user: [],
          name: 'task 1',
          feature: [],
          isComplete: false,
          priority: 10
        }
      })
    })
  })

  describe('/delete/', () => {
    const endpoint = path + '/delete/'
    test('', async () => {
      const res = await agent
        .delete(endpoint)
        .send({
          groupId: group._id,
          _id: task._id
        })
      expect(res.body.success).toBe(true)

      const guard = await agent
        .post(path + '/get/')
        .send({
          groupId: group._id,
          _id: task._id
        })

      expect(guard.body).toEqual({ success: false, msg: 'Task not found' })
    })
  })
})
