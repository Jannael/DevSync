import { IRefreshToken } from '../../../../backend/interface/user'
import model from './../../../../backend/model/group/model'
import userModel from './../../../../backend/model/user/model'

let user: IRefreshToken

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
      }, user.account, user._id)

      console.log(res)
    })
  })

  describe('exists', () => {})

  describe('get', () => {})

  describe('update', () => {})

  describe('remove', () => {})

  describe('member', () => {
    describe('add', () => {

    })

    describe('remove', () => {

    })
  })
})
