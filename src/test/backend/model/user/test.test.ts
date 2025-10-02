import { DatabaseError, DuplicateData } from '../../../../backend/error/error'
import { IUser } from '../../../../backend/interface/user'
import model from '../../../../backend/model/user/model'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ quiet: true })

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB')
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('user model', () => {
  describe('create user', () => {
    test('', async () => {
      const res = await model.user.create({
        fullName: 'test',
        account: 'test',
        pwd: 'test',
        role: ['documenter'],
        nickName: 'test',
        personalization: { theme: 'test' }
      })

      expect(res).toEqual({
        fullName: 'test',
        account: 'test',
        role: ['documenter'],
        nickName: 'test',
        personalization: { theme: 'test' }
      })
    })

    test('error', async () => {
      const func = [
        {
          fn: async function () {
            await model.user.create({
              fullName: 'test',
              account: 'test',
              pwd: 'test',
              role: ['documenter'],
              nickName: 'test',
              personalization: { theme: 'test' }
            })
          },
          error: new DuplicateData('This user already exists')
        },
        {
          fn: async function () {
            const obj = {
              account: 'test1',
              pwd: 'test1',
              role: ['documenter'],
              nickName: 'test1',
              personalization: { theme: 'test1' }
            } as unknown as IUser

            await model.user.create(obj)
          },
          error: new DatabaseError('Something went wrong while writing the user')
        }
      ]

      for (const { fn, error } of func) {
        await expect(fn()).rejects.toThrow(error)
      }
    })
  })
})
