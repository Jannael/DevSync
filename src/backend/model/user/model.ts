import { DatabaseError, DuplicateData } from '../../error/error'
import { IEnv } from '../../interface/env'
import dbModel from './../../database/schemas/node/user'
import { IUser } from './../../interface/user'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })
const { BCRYPT_SALT_HASH } = process.env as Pick<IEnv, 'BCRYPT_SALT_HASH'>

const model = {
  user: {
    create: async function (data: IUser): Promise<IUser> {
      try {
        const hashedPwd = await bcrypt.hash(data.pwd, BCRYPT_SALT_HASH)
        const payload = { ...data, pwd: hashedPwd }
        const result = await dbModel.insertOne({ ...payload })
        return result as IUser
      } catch (e: any) {
        if (e?.code === 11000) {
          throw new DuplicateData('this user already exists')
        }
        throw new DatabaseError('something went wrong while writing the user')
      }
    }
  }
}

export default model
