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

let user: IRefreshToken
let agent: ReturnType<typeof request.agent>
let group: IGroup
let app: Express
let task: ITask

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'>

beforeAll(async () => {
  app = await createApp(DB_URL_ENV_TEST, 'test')
  agent = await request.agent(app)
  user = await userModel.create({
    fullName: 'test',
    account: 'test@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })
  group = await groupModel.create({
    name: 'first group',
    color: '#000000'
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

  const taskId = await agent
    .post('/task/v1/create')
    .send({
      groupId: group._id.toString(),
      user: [user.account],
      name: 'task 1',
      priority: 10
    })

  const taskResult = await agent
    .post('/task/v1/get/')
    .send({ _id: taskId.body.result, groupId: group._id })

  task = taskResult.body.result
})

afterAll(async () => {
  await taskDbModel.deleteMany({})
  await dbUserModel.deleteMany({})
  await dbGroupModel.deleteMany({})
  await mongoose.connection.close()
})

describe('/solution/v1/', () => {
  const path = '/solution/v1'
  describe('/create/', () => {
    const endpoint = path + '/create/'
    test('', async () => {
      const res = await agent
        .post(endpoint)
        .send({
          groupId: group._id,
          taskId: task._id,
          data: {
            description: 'insane description for the task'
          }
        })

      expect(res.body.success).toEqual(true)
      expect(res.body.result).toBeDefined()
      expect(typeof res.body.result).toBe('string')
    })
  })

  describe('/get/', () => {
    test('', async () => {})
  })

  describe('/update/', () => {
    test('', async () => {})
  })

  describe('/delete/', () => {
    test('', async () => {})
  })
})
