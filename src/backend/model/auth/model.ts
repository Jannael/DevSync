import dbModel from './../../database/schemas/node/user'
import bcrypt from 'bcrypt'
import { IUser } from '../../interface/user'
import { NotFound, UserBadRequest } from '../../error/error'
import { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

const model = {
  verify: {
    refreshToken: async function (token: string, userId: typeof ObjectId): Promise<boolean> {
      try {
        const result = await dbModel.findOne(
          { _id: userId },
          { refreshToken: 1, _id: 0 }
        ).lean()

        const tokens = result?.refreshToken
        return Array.isArray(tokens) && tokens.includes(token)
      } catch (e) {
        return false
      }
    },
    login: async function (account: string, pwd: string): Promise<IUser> {
      const user = await dbModel.findOne({ account })
      if (user === null) { throw new NotFound('User not found') }

      const pwdIsCorrect = await bcrypt.compare(pwd, user.pwd as string)
      if (!pwdIsCorrect) { throw new UserBadRequest('Incorrect password') }

      return user as IUser
    }
  },
  auth: {
    refreshToken: {
      save: async function (token: string, userId: typeof ObjectId): Promise<boolean> {
        try {
          await dbModel.updateOne(
            { _id: userId },
            { $push: { refreshToken: token } }
          )
          return true
        } catch {
          return false
        }
      },
      remove: async function (token: string, userId: typeof ObjectId): Promise<boolean> {
        try {
          await dbModel.updateOne(
            { _id: userId },
            { $pull: { refreshToken: token } }
          )
          return true
        } catch {
          return false
        }
      }
    }
  }
}

export default model
