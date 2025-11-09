import { Types } from 'mongoose'
import dbModel from './../../database/schemas/node/group'
import { IGroup } from '../../interface/group'
import validator from '../../validator/validator'
import { DatabaseError, Forbidden, NotFound, UserBadRequest } from '../../error/error'

const model = {
  get: async function (id: Types.ObjectId): Promise<IGroup> {
    try {
      const res = await dbModel.findOne({ _id: id }).lean()
      if (res === null) throw new NotFound('Group not found', 'The group you are trying to access does not exist')
      return res
    } catch (e) {
      if (e instanceof NotFound) throw e
      throw new DatabaseError('Failed to access data')
    }
  },
  create: async function (data: IGroup): Promise<IGroup> {
    try {
      validator.group.create(data)
      const created = await dbModel.create(data)
      return created.toObject()
    } catch (e) {
      if (e instanceof UserBadRequest) throw e
      throw new DatabaseError('Failed to save', 'The group was not created, something went wrong please try again')
    }
  },
  update: async function (techLeadId: Types.ObjectId, groupId: Types.ObjectId, data: Partial<IGroup>): Promise<IGroup> {
    validator.group.partial(data)
    const isTechLead = await dbModel.exists({ _id: groupId, 'techLead._id': techLeadId })
    if (isTechLead === null) throw new Forbidden('Access denied', 'Only tech leads can update group information')

    const updated = await dbModel.updateOne({ _id: groupId }, data)
    if (updated.matchedCount === 0) throw new NotFound('Group not found', 'The group you are trying to update does not exist')

    const group = await dbModel.findOne({ _id: groupId }).lean()
    if (group === null) throw new NotFound('Group not found', 'The group you are trying to update does not exist')

    return group
  }
}

export default model
