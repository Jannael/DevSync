import { DatabaseError, DuplicateData, NotFound, UserBadRequest } from '../../error/error'
import { IEnv } from '../../interface/env'
import { verifyEmail } from '../../utils/utils'
import dbModel from './../../database/schemas/node/user'
import { IRefreshToken, IUser } from './../../interface/user'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Types } from 'mongoose'

dotenv.config({ quiet: true })
const { BCRYPT_SALT_HASH } = process.env as Pick<IEnv, 'BCRYPT_SALT_HASH'>

const model = {
  user: {
    create: async function (data: IUser): Promise<IRefreshToken> {
      try {
        if (data._id !== undefined) throw new UserBadRequest('You cant put the _id yourself')
        if (data.refreshToken !== undefined) throw new UserBadRequest('You cant put the refreshToken yourself')

        const isValidAccount = verifyEmail(data.account)
        if (!isValidAccount) throw new UserBadRequest('Invalid account it must match example@service.ext')

        const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
        const hashedPwd = await bcrypt.hash(data.pwd, salt)
        const payload = { ...data, pwd: hashedPwd }
        const result = await dbModel.insertOne({ ...payload })
        const user = await dbModel.findOne({ _id: result._id },
          { pwd: 0, refreshToken: 0 }
        ).lean()

        if (user === null) throw new NotFound('User do not exist')

        return user
      } catch (e: any) {
        if (e?.code === 11000) throw new DuplicateData('This user already exists')
        else if (e instanceof UserBadRequest) throw e
        else if (e instanceof NotFound) throw e

        throw new DatabaseError('Something went wrong while writing the user')
      }
    },
    update: async function (data: Partial<IUser>, userId: Types.ObjectId): Promise<IRefreshToken> {
      if (data.pwd !== undefined) {
        const pwd = await bcrypt.hash(data.pwd, BCRYPT_SALT_HASH)
        data.pwd = pwd
      }

      if (data.account !== undefined) throw new UserBadRequest('You need to use the endpoint for account change')
      if (data._id !== undefined) throw new UserBadRequest('You cant change the _id field')
      if (data.refreshToken !== undefined) throw new UserBadRequest('You cant change the refreshToken field')

      const user = await dbModel.updateOne({ _id: userId }, { ...data })
      if (user.matchedCount === 0) throw new NotFound('User does not exist')
      const refreshToken = await dbModel.findOne({ _id: userId }, { pwd: 0, refreshToken: 0 }).lean()

      if (user.acknowledged && refreshToken !== null) {
        return refreshToken
      }

      throw new NotFound('User does not exist')
    },
    delete: async function (userId: Types.ObjectId): Promise<boolean> {
      const result = await dbModel.deleteOne({ _id: userId })

      if (result.acknowledged && result.deletedCount === 1) { return true }
      throw new NotFound('User may not exist or the id is incorrect')
    },
    account: {
      update: async function (userId: Types.ObjectId, account: string): Promise<IRefreshToken> {
        const response = await dbModel.updateOne({ _id: userId }, { account })
        if (response.matchedCount === 0) throw new NotFound('User does not exist')

        const user = await dbModel.findOne({ _id: userId }, { refreshToken: 0, pwd: 0 }).lean()
        if (user === null) throw new NotFound('User does not exist')
        return user
      }
    }
  }
}

export default model
