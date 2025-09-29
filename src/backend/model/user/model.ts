import { DatabaseError, DuplicateData, NotFound } from '../../error/error'
import { IEnv } from '../../interface/env'
import dbModel from './../../database/schemas/node/user'
import { IUser } from './../../interface/user'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Schema } from 'mongoose'

const { ObjectId } = Schema.Types

dotenv.config({ quiet: true })
const { BCRYPT_SALT_HASH } = process.env as Pick<IEnv, 'BCRYPT_SALT_HASH'>

const model = {
  user: {
    create: async function (data: IUser): Promise<IUser> {
      try {
        const hashedPwd = await bcrypt.hash(data.pwd, BCRYPT_SALT_HASH)
        const payload = { ...data, pwd: hashedPwd }
        const result = await dbModel.create({ ...payload })
        return result as IUser
      } catch (e: any) {
        if (e?.code === 11000) {
          throw new DuplicateData('this user already exists')
        }
        throw new DatabaseError('something went wrong while writing the user')
      }
    },
    update: async function (data: Partial<Omit<IUser, '_id' | 'refreshToken'>>, userId: typeof ObjectId): Promise<boolean> {
      if (data.pwd !== undefined) {
        const pwd = await bcrypt.hash(data.pwd, BCRYPT_SALT_HASH)
        data.pwd = pwd
      }

      const user = await dbModel.updateOne({ _id: userId }, { ...data })
      if (user.matchedCount === 0) throw new NotFound('user does not exist')

      return user.acknowledged
    },
    delete: async function (userId: typeof ObjectId) {
      const result = await dbModel.deleteOne({ _id: userId })

      if (result.acknowledged && result.deletedCount !== 0) return true
      return false
    }
  }
}

export default model
