import userModel from './../../../../backend/model/user/model'
import model from './../../../../backend/model/auth/model'
import mongoose, { Types } from 'mongoose'
import dotenv from 'dotenv'
import dbModel from '../../../../backend/database/schemas/node/user'
import { IEnv } from '../../../../backend/interface/env'
import { IRefreshToken } from '../../../../backend/interface/user'
import { UserBadRequest } from '../../../../backend/error/error'

dotenv.config({ quiet: true })
const { DBURL_ENV_TEST } = process.env as Pick<IEnv, 'DBURL_ENV_TEST'>

beforeAll(async () => {
  await mongoose.connect(DBURL_ENV_TEST)
})

afterAll(async () => {
  await dbModel.deleteMany({})
  await mongoose.connection.close()
})

describe('auth model', () => {
  let user: IRefreshToken
  const notExistUser = '68de8beca3acccec4ac2fddb' as unknown as Types.ObjectId

  beforeAll(async () => {
    user = await userModel.user.create({
      fullName: 'test',
      account: 'test',
      pwd: 'test',
      role: ['documenter'],
      nickName: 'test',
      personalization: { theme: 'test' }
    })
  })

  describe('auth refreshToken', () => {
    describe('save refreshToken', () => {
      test('', async () => {
        const res = await model.auth.refreshToken.save('token', user._id)
        expect(res).toBe(true)
      })

      test('error', async () => {
        const func = [
          {
            fn: async function () {
              await model.auth.refreshToken.save('', notExistUser)
            },
            error: new UserBadRequest('User does not exist')
          }
        ]

        for (const { fn, error } of func) {
          await expect(fn()).rejects.toThrow(error)
        }
      })
    })

    describe('remove refreshToken', () => {
      test('', async () => {
        const res = await model.auth.refreshToken.remove('token', user._id)
        expect(res).toBe(true)
      })

      test('error', async () => {
        const func = [
          {
            fn: async function () {
              await model.auth.refreshToken.remove('', notExistUser)
            },
            error: new UserBadRequest('User does not exist')
          },
          {
            fn: async function () {
              await model.auth.refreshToken.remove('', '' as unknown as Types.ObjectId)
            },
            error: new UserBadRequest('Invalid user ID')
          }
        ]

        for (const { fn, error } of func) {
          await expect(fn()).rejects.toThrow(error)
        }
      })
    })
  })

  describe('verify refreshToken', () => {
    test('', async () => {
      // first we save the token to verify it
      const save = await model.auth.refreshToken.save('token', user._id)
      expect(save).toBe(true)

      const res = await model.verify.refreshToken('token', user._id)
      expect(res).toBe(true)

      await model.auth.refreshToken.remove('token', user._id)
    })

    test('error', async () => {

    })
  })

  describe('verify login', () => {
    test('', async () => {

    })

    test('error', async () => {

    })
  })
})
