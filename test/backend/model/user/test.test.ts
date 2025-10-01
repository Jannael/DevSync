import { IEnv } from '../../../../src/backend/interface/env'
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
})