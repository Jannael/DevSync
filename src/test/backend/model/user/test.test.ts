import { DuplicateData, NotFound, UserBadRequest, Forbidden } from '../../../../backend/error/error'
import { IEnv } from '../../../../backend/interface/env'
import { IRefreshToken, IUser } from '../../../../backend/interface/user'
import { IGroup } from '../../../../backend/interface/group'
import model from '../../../../backend/model/user/model'
import dbModel from './../../../../backend/database/schemas/node/user'
import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import groupModel from '../../../../backend/model/group/model'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

beforeAll(async () => {
  await mongoose.connect(DB_URL_ENV_TEST)
})

afterAll(async () => {
  await dbModel.deleteMany({})
  await mongoose.connection.close()
})

describe('user model', () => {
  let group: IGroup

  let userId: Types.ObjectId
  let user: IRefreshToken = {
    _id: '' as unknown as Types.ObjectId,
    fullName: 'test',
    account: 'test@gmail.com',
    nickName: 'test'
  }

  let secondUser: IRefreshToken = {
    _id: '' as unknown as Types.ObjectId,
    fullName: 'veronica',
    account: 'veronica@gmail.com',
    nickName: 'test'
  }

  beforeAll(async () => {
    secondUser = await model.create({
      fullName: 'veronica',
      account: 'veronica@gmail.com',
      nickName: 'test',
      pwd: 'test'
    })
  })

  const notExistUser = new mongoose.Types.ObjectId()

  describe('create user', () => {
    test('', async () => {
      const res = await model.create({
        fullName: 'test',
        account: 'test@gmail.com',
        pwd: 'test',
        nickName: 'test'
      })

      userId = res._id
      user = res

      expect(res).toStrictEqual({
        _id: expect.any(Types.ObjectId),
        fullName: 'test',
        account: 'test@gmail.com',
        nickName: 'test'
      })

      group = await groupModel.create({
        name: 'test',
        color: '#000000'
      }, { account: user.account, fullName: user.fullName, _id: user._id })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.create({
              fullName: 'test',
              account: 'test@gmail.com',
              pwd: 'test',
              nickName: 'test'
            })
          },
          error: new DuplicateData('User already exists', 'This account belongs to an existing user')
        },
        {
          fn: async function () {
            const obj = {
              account: 'test1@gmail.com',
              pwd: 'test1',
              nickName: 'test1'
            } as unknown as IUser

            await model.create(obj)
          },
          error: new UserBadRequest('Invalid credentials', 'FullName is required')
        },
        {
          fn: async function () {
            const obj = {
              _id: '' as unknown as Types.ObjectId,
              refreshToken: ['hello Dexter Morgan'],
              fullName: 'test',
              account: 'test@gmail.com',
              pwd: 'test',
              nickName: 'test'
            }

            await model.create(obj)
          },
          error: new UserBadRequest('Invalid credentials', 'You can not put the _id yourself')
        },
        {
          fn: async function () {
            const obj = {
              refreshToken: ['hello Dexter Morgan'],
              fullName: 'test',
              account: 'test@gmail.com',
              pwd: 'test',
              nickName: 'test'
            }

            await model.create(obj)
          },
          error: new UserBadRequest('Invalid credentials', 'You can not put the refreshToken yourself')
        },
        {
          fn: async function () {
            const obj = {
              fullName: 'test',
              account: 'test',
              pwd: 'test',
              nickName: 'test'
            }

            await model.create(obj)
          },
          error: new UserBadRequest('Invalid credentials', 'Invalid email address')
        }
      ]

      for (const { fn, error } of func) {
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

  describe('update user', () => {
    test('', async () => {
      const res = await model.update({
        fullName: 'test1'
      }, userId)

      expect(res).toStrictEqual({
        _id: expect.any(Types.ObjectId),
        account: 'test@gmail.com',
        fullName: 'test1',
        nickName: 'test'
      })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.update({ }, notExistUser)
          },
          error: new NotFound('User not found')
        },
        {
          fn: async function () {
            await model.update({ account: 'test' }, userId)
          },
          error: new UserBadRequest('Invalid credentials', 'You can not update the account here')
        },
        {
          fn: async function () {
            await model.update({ _id: notExistUser }, userId)
          },
          error: new UserBadRequest('Invalid credentials', 'You can not change the _id')
        },
        {
          fn: async function () {
            await model.update({ refreshToken: ['hello Dexter Morgan'] }, userId)
          },
          error: new UserBadRequest('Invalid credentials', 'You can not update the refreshToken')
        }
      ]

      for (const { fn, error } of func) {
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

  describe('update user account', () => {
    test('', async () => {
      const res = await model.account.update(userId, 'test2@gmail.com')
      user = res

      expect(res).toStrictEqual({
        _id: expect.any(Types.ObjectId),
        fullName: 'test1',
        account: 'test2@gmail.com',
        nickName: 'test'
      })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.account.update(notExistUser, 'test@gmail.com')
          },
          error: new NotFound('User not found')
        },
        {
          fn: async function () {
            await model.account.update(userId, 'test')
          },
          error: new UserBadRequest('Invalid credentials', 'The account must match example@service.ext')
        },
        {
          fn: async function () {
            await model.account.update(userId, user.account)
          },
          error: new DuplicateData('User already exists', 'This account belongs to an existing user')
        }
      ]

      for (const { fn, error } of func) {
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

  describe('update user password', () => {
    test('', async () => {
      const res = await model.password.update(user.account, 'newPassword')
      expect(res).toEqual(true)
    })

    test('error', async () => {
      const cases = [
        {
          fn: async function () {
            await model.password.update('test', 'test')
          },
          error: new UserBadRequest('Invalid credentials', 'The account must match example@service.ext')
        },
        {
          fn: async function () {
            await model.password.update('helloDexterMorgan@gmail.com.mx', 'test')
          },
          error: new NotFound('User not found')
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

  describe('invitation', () => {
    describe('create user invitation', () => {
      test('', async () => {
        const res = await model.invitation.create({
          account: secondUser.account,
          fullName: secondUser.fullName,
          role: 'techLead'
        }, {
          _id: group._id,
          name: group.name,
          color: group.color
        }, user._id)

        expect(res).toBe(true)
      })

      test('error', async () => {
        const cases = [
          {
            fn: async function () {
              await model.invitation.create({
                account: user.account,
                fullName: user.fullName,
                role: 'techLead'
              }, {
                _id: notExistUser,
                name: 'no group',
                color: '#000000'
              }, user._id)
            },
            error: new NotFound('Group not found', 'The group you are trying to access does not exist')
          },
          {
            fn: async function () {
              await model.invitation.create({
                account: user.account,
                fullName: user.fullName,
                role: 'techLead'
              }, {
                _id: notExistUser,
                name: 'no group',
                color: '1234567'
              }, user._id)
            },
            error: new UserBadRequest('Invalid credentials', 'Color must be a valid hex code')
          },
          {
            fn: async function () {
              await model.invitation.create({
                account: 'veronica@gmail.com',
                fullName: user.fullName,
                role: 'techLead'
              }, {
                _id: group._id,
                name: group.name,
                color: group.color
              }, user._id)
            },
            error: new NotFound('User not found')
          },
          {
            fn: async function () {
              await model.invitation.create({
                account: user.account,
                fullName: user.fullName,
                role: 'techLead'
              }, {
                _id: group._id,
                name: group.name,
                color: group.color
              }, user._id)
            },
            error: new Forbidden('Access denied', 'The user with the account test2@gmail.com already has an invitation for the group')
          }
        ]

        for (const { fn, error } of cases) {
          try {
            await fn()
            throw new Error('Expected function to throw')
          } catch (err: any) {
            expect(err.message).toBe(error.message)
            expect(err.description).toBe(error.description)
          }
        }
      })
    })

    describe('remove user invitation', () => {
      test('', async () => {
      })

      test('error', async () => {

      })
    })

    describe('get user invitation', () => {
      test('', async () => {
      })

      test('error', async () => {
      })
    })
  })

  describe('group', () => {
    describe('add user group', () => {
      test('', async () => {
      })

      test('error', async () => {
      })
    })

    describe('remove user group', () => {
      test('', async () => {
        const res = await model.group.remove(user.account, userId)
        expect(res).toBe(true)
      })

      test('error', async () => {
        const func = [
          {
            fn: async function () {
              await model.group.remove(user.account, new mongoose.Types.ObjectId())
            },
            error: new NotFound('User not found')
          },
          {
            fn: async function () {
              await model.group.remove(user.account, 'invalidId' as unknown as Types.ObjectId)
            },
            error: new UserBadRequest('Invalid credentials', 'The group _id is invalid')
          }
        ]
        for (const { fn, error } of func) {
          try {
            await fn()
          } catch (err: any) {
            expect(err).toBeInstanceOf(error.constructor)
            expect(err.message).toBe(error.message)
            expect(err.description).toBe(error.description)
          }
        }
      })
    })

    describe('get user group', () => {
      test('', async () => {
      })

      test('error', async () => {
      })
    })
  })

  describe('delete user', () => {
    test('', async () => {
      await groupModel.delete('test@gmail.com', group._id)
      const res = await model.delete(userId)

      expect(res).toBe(true)
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.delete(notExistUser)
          },
          error: new NotFound('User not found')
        }
      ]

      for (const { fn, error } of func) {
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
})
