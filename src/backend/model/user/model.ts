import { DatabaseError, DuplicateData } from '../../error/error'
import dbModel from './../../database/schemas/node/user'
import { IUser } from './../../interface/user'

const model = {
  create: {
    user: async function (data: IUser): Promise<IUser> {
      try {
        const result = await dbModel.insertOne({ ...data })
        return result as IUser
      } catch (e: any) {
        if (e?.code === 11000) {
          throw new DuplicateData('this user already exists')
        }
        throw new DatabaseError('something went wrong while writing the user')
      }
    }
  },
  read: {},
  update: {},
  delete: {}
}

export default model
