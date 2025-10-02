import dbModel from './../../database/schemas/node/user'
import bcrypt from 'bcrypt'
import { IRefreshToken } from '../../interface/user'
import { NotFound, UserBadRequest } from '../../error/error'
import { Types } from 'mongoose'

const model = {
  verify: {
    refreshToken: async function (token: string, userId: Types.ObjectId): Promise<boolean> {
      const result = await dbModel.findOne(
        { _id: userId },
        { refreshToken: 1, _id: 0 }
      ).lean()

      console.log(result)

      const tokens = result?.refreshToken
      return Array.isArray(tokens) && tokens.includes(token)
    },
    login: async function (account: string, pwd: string): Promise<IRefreshToken> {
      const user = await dbModel.findOne(
        { account },
        { refreshToken: 0, pwd: 0 }
      ).lean()

      if (user === null) { throw new NotFound('User not found') }

      const pwdIsCorrect = await bcrypt.compare(pwd, user.pwd)
      if (!pwdIsCorrect) { throw new UserBadRequest('Incorrect password') }

      return user
    }
  },
  auth: {
    refreshToken: {
      save: async function (token: string, userId: Types.ObjectId): Promise<boolean> {
        const user = await dbModel.findOne({ _id: userId }, {
          fullName: 0, account: 0, pwd: 0, role: 0, nickName: 0, personalization: 0, refreshToken: 0
        }).lean()

        if (user === null) throw new UserBadRequest('User does not exist')

        const result = await dbModel.updateOne(
          { _id: userId },
          { $push: { refreshToken: token } }
        )

        return result.matchedCount === 1 && result.modifiedCount === 1
      },
      remove: async function (token: string, userId: Types.ObjectId): Promise<boolean> {
        const user = await dbModel.findOne({ _id: userId }, {
          fullName: 0, account: 0, pwd: 0, role: 0, nickName: 0, personalization: 0, refreshToken: 0
        }).lean()

        if (user === null) throw new UserBadRequest('User does not exist')

        const result = await dbModel.updateOne(
          { _id: userId },
          { $pull: { refreshToken: token } }
        )

        return result.matchedCount === 1 && result.modifiedCount === 1
      }
    }
  }
}

export default model
