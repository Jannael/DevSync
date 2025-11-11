import { IRefreshToken } from '../../../../backend/interface/user'
import model from './../../../../backend/model/group/model'
import userModel from './../../../../backend/model/user/model'

import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import dbModel from './../../../../backend/database/schemas/node/group'
import { IEnv } from '../../../../backend/interface/env'
import userDbModel from './../../../../backend/database/schemas/node/user'
import { IGroup } from '../../../../backend/interface/group'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

beforeAll(async () => {
  await mongoose.connect(DB_URL_ENV_TEST)
})

afterAll(async () => {
  await dbModel.deleteMany({})
  await userDbModel.deleteMany({})
  await mongoose.connection.close()
})

let user: IRefreshToken
let group: IGroup

beforeAll(async () => {
  user = await userModel.create({
    fullName: 'test',
    account: 'test@gmail.com',
    pwd: 'test',
    nickName: 'test'
  })
})

describe('group model', () => {
  describe('create', () => {
    test('', async () => {
      const res = await model.create({
        name: 'test',
        color: '#000000'
      }, { account: user.account, fullName: user.fullName })

      group = res

      expect(res).toStrictEqual({
        name: 'test',
        color: '#000000',
        _id: expect.any(Types.ObjectId),
        techLead: [{ account: user.account, fullName: user.fullName }],
        member: []
      })
    })
  })

  describe('exists', () => {})

  describe('get', () => {})

  describe('update', () => {})

  describe('delete', () => {
    test('', async () => {
      const res = await model.delete(user.account, group._id)
      console.log('delete', res)
    })

    test('error', () => {

    })
  })

  describe('member', () => {
    describe('add', () => {

    })

    describe('remove', () => {

    })
  })
})
