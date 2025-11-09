import { Types } from 'mongoose'
import dbModel from './../../database/schemas/node/group'
import { IGroup } from '../../interface/group'
import validator from '../../validator/validator'
import { CustomError, DatabaseError, Forbidden, NotFound } from '../../error/error'
import UserModel from '../user/model'
import errorHandler from '../../error/handler'

const model = {
  get: async function (id: Types.ObjectId): Promise<IGroup> {
    try {
      const res = await dbModel.findOne({ _id: id }).lean()
      if (res === null) throw new NotFound('Group not found', 'The group you are trying to access does not exist')
      return res
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to access data', 'The group was not retrieved, something went wrong please try again')
      )
      throw new DatabaseError('Failed to access data', 'The group was not retrieved, something went wrong please try again')
    }
  },
  exists: async function (id: Types.ObjectId): Promise<boolean> {
    try {
      const res = await dbModel.exists({ _id: id })
      if (res === null || res === undefined) throw new NotFound('Group not found', 'The group you are trying to access does not exist')
      return true
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to access data', 'The group existence could not be verified, something went wrong please try again')
      )
      throw new DatabaseError('Failed to access data', 'The group existence could not be verified, something went wrong please try again')
    }
  },
  create: async function (data: IGroup, techLead: string): Promise<IGroup> {
    try {
      validator.group.create(data)

      const created = await dbModel.create(data)

      for (const techLead of data.techLead) {
        await UserModel.invitation.create(techLead.account, {
          _id: created._id,
          name: created.name,
          color: created.color
        })
      }

      for (const member of data.member) {
        await UserModel.invitation.create(member.account, {
          _id: created._id,
          name: created.name,
          color: created.color
        })
      }

      await UserModel.group.add(techLead, {
        _id: created._id,
        name: created.name,
        color: created.color
      })

      return created.toObject()
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to save', 'The group was not created, something went wrong please try again')
      )
      throw new DatabaseError('Failed to save', 'The group was not created, something went wrong please try again')
    }
  },
  update: async function (techLeadId: Types.ObjectId, groupId: Types.ObjectId, data: Partial<IGroup>): Promise<IGroup> {
    try {
      validator.group.partial(data)
      const isTechLead = await dbModel.exists({ _id: groupId, 'techLead._id': techLeadId })
      if (isTechLead === null) throw new Forbidden('Access denied', 'Only tech leads can update group information')

      const updated = await dbModel.updateOne({ _id: groupId }, data)
      if (updated.matchedCount === 0) throw new NotFound('Group not found', 'The group you are trying to update does not exist')

      const group = await dbModel.findOne({ _id: groupId }).lean()
      if (group === null) throw new NotFound('Group not found', 'The group you are trying to update does not exist')

      return group
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to save', 'The group was not updated, something went wrong please try again')
      )
      throw new DatabaseError('Failed to save', 'The group was not updated, something went wrong please try again')
    }
  },
  remove: async function (techLeadId: Types.ObjectId, groupId: Types.ObjectId): Promise<boolean> {
    try {
      const isTechLead = await dbModel.exists({ _id: groupId, 'techLead._id': techLeadId })
      if (isTechLead === null) throw new Forbidden('Access denied', 'Only tech leads can delete a group')

      const members = await dbModel.findOne({ _id: groupId }, { member: 1 }).lean()
      if (members === null) throw new NotFound('Group not found', 'The group you are trying to delete does not exist')
      for (const member of members.member) {
        await UserModel.group.remove(member.account, groupId)
      }

      const deleted = await dbModel.deleteOne({ _id: groupId })
      if (deleted.deletedCount === 0) throw new NotFound('Group not found', 'The group you are trying to delete does not exist')
      return true
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to remove', 'The group was not deleted, something went wrong please try again')
      )
      throw new DatabaseError('Failed to remove', 'The group was not deleted, something went wrong please try again')
    }
  }
}

export default model
