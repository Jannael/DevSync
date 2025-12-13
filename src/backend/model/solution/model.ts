import { Types } from 'mongoose'
import dbModel from './../../database/schemas/node/solution'
import handler from '../../error/handler'
import { CustomError, DatabaseError } from '../../error/error'
import { ISolution } from '../../interface/solution'

const model = {
  get: async function (_id: Types.ObjectId): Promise<ISolution> {
    try {

    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
      )
    }
  },
  create: async function (_id: Types.ObjectId, data: Omit<ISolution, '_id'>): Promise<Types.ObjectId> {
    try {

    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
      )
    }
  },
  update: async function (_id: Types.ObjectId, data: Partial<Omit<ISolution, '_id'>>): Promise<boolean> {
    try {

    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
      )
    }
  },
  delete: async function (_id: Types.ObjectId): Promise<boolean> {
    try {

    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The solution was not retrieved please try again')
      )
    }
  }
}

export default model
