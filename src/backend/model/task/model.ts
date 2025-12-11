import { Types } from 'mongoose'
import { CustomError, DatabaseError } from '../../error/error'
import handler from '../../error/handler'
import dbModel from './../../database/schemas/node/task'

const model = {
  get: async function (taskId: Types.ObjectId) {
    try {
      const res = await dbModel.findOne({ _id: taskId })
      return res
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The task was not retrieved please try again')
      )
      throw new DatabaseError('Failed to access data', 'The task was not retrieved please try again')
    }
  },
  create: async function () {},
  update: async function () {},
  delete: async function () {}
}

export default model
