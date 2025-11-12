import { IRefreshToken } from '../../../../backend/interface/user'
import model from './../../../../backend/model/group/model'
import userModel from './../../../../backend/model/user/model'

import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import dbModel from './../../../../backend/database/schemas/node/group'
import { IEnv } from '../../../../backend/interface/env'
import userDbModel from './../../../../backend/database/schemas/node/user'
import { IGroup } from '../../../../backend/interface/group'
import { Forbidden, NotFound } from '../../../../backend/error/error'

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
        _id: expect.any(Types.ObjectId)
      })
    })
  })

  describe('exists', () => {
    test('', async () => {
      const res = await model.exists(group, user.account)
      expect(res).toEqual(true)
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            await model.exists(group, 'notExist@gmail.com')
          },
          error: new Forbidden('Access denied', 'The group exists but the user is not a techLead')
        },
        {
          fn: async function () {
            await model.exists({ ...group, _id: new mongoose.Types.ObjectId() }, user.account)
          },
          error: new NotFound('Group not found', 'The group you are trying to access does not exist')
        }
      ]

      for (const { fn, error } of cases) {
        try {
          await fn()
          throw new Error('Expected function to throw')
        } catch (err: any) {
          expect(err).toBeInstanceOf(error.constructor)
          expect(err.message).toBe(error.message)
          expect(err.description).toBe(error.description)
        }
      }
    })
  })

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
