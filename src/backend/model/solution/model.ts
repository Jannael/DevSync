import { Types } from 'mongoose'
import dbModel from './../../database/schemas/node/solution'
import handler from '../../error/handler'
import { CustomError, DatabaseError, NotFound } from '../../error/error'
import { ISolution } from '../../interface/solution'

const model = {
  get: async function (_id: Types.ObjectId): Promise<ISolution> {
    try {
      const res = await dbModel.findOne({ _id }).lean<ISolution>()
      if (res === null) throw new NotFound('Solution not found')
      return res
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
      )
      throw new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
    }
  },
  create: async function (data: ISolution): Promise<Types.ObjectId> {
    try {
      const res = await dbModel.insertOne({ data })
      return res._id
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to save', 'The solution was not created please try again')
      )
      throw new DatabaseError('Failed to save', 'The solution was not created please try again')
    }
  },
  update: async function (_id: Types.ObjectId, data: Partial<Omit<ISolution, '_id'>>): Promise<boolean> {
    try {
      const res = await dbModel.updateOne({ _id }, { ...data })
      return res.acknowledged
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to save', 'The solution was not updated please try again')
      )
      throw new DatabaseError('Failed to save', 'The solution was not updated please try again')
    }
  },
  delete: async function (_id: Types.ObjectId): Promise<boolean> {
    try {
      const res = await dbModel.deleteOne({ _id })
      return res.acknowledged
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to remove', 'The solution was not deleted please try again')
      )
      throw new DatabaseError('Failed to remove', 'The solution was not deleted please try again')
    }
  }
}

export default model
