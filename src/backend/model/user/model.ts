import { DatabaseError, DuplicateData, NotFound } from '../../error/error'
import { IEnv } from '../../interface/env'
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
        const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
        const hashedPwd = await bcrypt.hash(data.pwd, salt)
        const payload = { ...data, pwd: hashedPwd }
        const result = await dbModel.insertOne({ ...payload })
        const user = await dbModel.findOne({ _id: result._id },
          { pwd: 0, refreshToken: 0 }
        ).lean()

        if (user === null) throw new NotFound('User dont exist')

        return user
      } catch (e: any) {
        if (e?.code === 11000) {
          throw new DuplicateData('This user already exists')
        }
        throw new DatabaseError('Something went wrong while writing the user')
      }
    },
    update: async function (data: Partial<Omit<IUser, '_id' | 'refreshToken'>>, userId: Types.ObjectId): Promise<IRefreshToken | null> {
      if (data.pwd !== undefined) {
        const pwd = await bcrypt.hash(data.pwd, BCRYPT_SALT_HASH)
        data.pwd = pwd
      }

      const user = await dbModel.updateOne({ _id: userId }, { ...data })
      if (user.matchedCount === 0) throw new NotFound('User does not exist')

      if (user.acknowledged) {
        return await dbModel.findOne({ _id: userId }, { pwd: 0, refreshToken: 0 })
      }

      return null
    },
    delete: async function (userId: Types.ObjectId) {
      const result = await dbModel.deleteOne({ _id: userId })

      if (result.acknowledged && result.deletedCount !== 0) return true
      return false
    },
    account: {
      update: async function (userId: Types.ObjectId, account: string) {
        const response = await dbModel.updateOne({ _id: userId }, { account })
        if (response.matchedCount === 0) throw new NotFound('User does not exist')

        return response.acknowledged
      }
    }
  }
}

export default model
