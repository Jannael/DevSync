import dbModel from './../../database/schemas/node/user'
import { IUser } from './../../interface/user'

const model = {
  create: {
    user: async function (data: IUser): Promise<IUser | null> {
      try {
        const result = await dbModel.insertOne({ ...data })
        return result as IUser
      } catch (e) {
        return null
      }
    }
  },
  read: {},
  update: {},
  delete: {}
}

export default model
