import { Types } from 'mongoose'
import dbModel from './../../database/schemas/node/group'
import { IGroup } from '../../interface/group'

const model = {
  get: async function (id: Types.ObjectId): Promise<IGroup | null> {
    return await dbModel.findOne({ _id: id }).lean()
  },
  create: async function (data: IGroup): Promise<IGroup> {
    const created = await dbModel.create(data)
    return created.toObject()
  }
}

export default model
