import userModel from './../../../../backend/model/user/model'
import model from './../../../../backend/model/auth/model'
import mongoose, { Types } from 'mongoose'
import dotenv from 'dotenv'
import dbModel from '../../../../backend/database/schemas/node/user'
import { IEnv } from '../../../../backend/interface/env'
import { IRefreshToken } from '../../../../backend/interface/user'
import { NotFound, UserBadRequest } from '../../../../backend/error/error'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

beforeAll(async () => {
  await mongoose.connect(DB_URL_ENV_TEST)
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
      account: 'test@email.com',
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
      const func = [
        {
          fn: async function () {
            await model.verify.refreshToken('token', notExistUser)
          },
          error: new NotFound('User do not found check the _id')
        },
        {
          fn: async function () {
            await model.verify.refreshToken('token', 'invalid' as unknown as Types.ObjectId)
          },
          error: new UserBadRequest('Invalid user ID')
        }
      ]

      for (const { fn, error } of func) {
        await expect(fn()).rejects.toThrow(error)
      }
    })
  })

  describe('verify login', () => {
    test('', async () => {
      const res = await model.verify.login(user.account, 'test')

      expect(res).toStrictEqual({
        _id: expect.any(Types.ObjectId),
        fullName: 'test',
        account: 'test@email.com',
        role: ['documenter'],
        nickName: 'test',
        personalization: { theme: 'test' }
      })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.verify.login('account', 'pwd')
          },
          error: new UserBadRequest('Invalid account it must match example@service.ext')
        },
        {
          fn: async function () {
            await model.verify.login('account@gmail.com', 'pwd')
          },
          error: new NotFound('User not found')
        },
        {
          fn: async function () {
            await model.verify.login('test@email.com', 'pwd')
          },
          error: new UserBadRequest('Incorrect password')
        }
      ]

      for (const { fn, error } of func) {
        await expect(fn()).rejects.toThrow(error)
      }
    })
  })
})
