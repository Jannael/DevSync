import { DatabaseError, DuplicateData } from '../../../../src/backend/error/error'
import { IEnv } from '../../../../src/backend/interface/env'
import { IUser } from '../../../../src/backend/interface/user'
import model from './../../../../src/backend/model/user/model'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ quiet: true })
const { DBURL_ENV_TEST } = process.env as Pick<IEnv, 'DBURL_ENV_TEST'>

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB')
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('user model', () => {
  test('create user', async () => {
    const res = await model.user.create({
      fullName: 'test',
      account: 'test',
      pwd: 'test',
      role: [ 'documenter' ],
      nickName: 'test',
      personalization: { theme: 'test' }
    })

    expect(res).toEqual({
        fullName: 'test',
        account: 'test',
        role: [ 'documenter' ],
        nickName: 'test',
        personalization: { theme: 'test' }  
    })
  })

  test('create user errors', async () => {
    const func = [
      {
        fn: async function () {
          await model.user.create({
            fullName: 'test',
            account: 'test',
            pwd: 'test',
            role: [ 'documenter' ],
            nickName: 'test',
            personalization: { theme: 'test' }
          })
        },
        error: new DuplicateData('This user already exists')
      },
      {
        fn: async function () {
          await model.user.create({
            account: 'test1',
            pwd: 'test1',
            role: [ 'documenter' ],
            nickName: 'test1',
            personalization: { theme: 'test1' }
          } as IUser)
        },
        error: new DatabaseError('Something went wrong while writing the user')
      }
    ]
    
    for(const { fn, error } of func) {
      await expect(fn()).rejects.toThrow(error)
    }
  })
})