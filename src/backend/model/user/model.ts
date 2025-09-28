import dbModel from './../../database/schemas/node/user'
import { IUser } from './../../interface/user'

const model = {
  create: {
    user: async function (data: ) {
      try {
        dbModel.insertOne({ ...data })
      } catch (e) {

      }
    }
  },
  read: {},
  update: {},
  delete: {}
}

export default model
