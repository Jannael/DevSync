import { Types } from 'mongoose'
import { CustomError, DatabaseError, NotFound } from '../../error/error'
import handler from '../../error/handler'
import dbModel from './../../database/schemas/node/task'
import { IListTask, ITask } from '../../interface/task'

const model = {
  list: async function (groupId: Types.ObjectId, userAccount: string, pagination: number): Promise<IListTask> {
    try {
      const allTasks = await dbModel.find({ groupId }, {
        _id: 1,
        name: 1,
        priority: 1,
        isComplete: 1,
        user: 1
      }).skip(pagination * 10).limit(10).lean<
      Array<Pick<ITask, '_id' | 'name' | 'priority' | 'isComplete' | 'user'>>
      >()

      if (allTasks === null) throw new NotFound('Group not found', 'The group may not have any tasks')

      const response: IListTask = allTasks.reduce<IListTask>((acc, task) => {
        acc.task.push({
          _id: task._id,
          name: task.name,
          priority: task.priority,
          isComplete: task.isComplete
        })

        if (task.user.includes(userAccount)) acc.assign.push(task._id)

        return acc
      }, { task: [], assign: [] })

      return response
    } catch (e) {
      handler.allErrors(e as CustomError,
        new DatabaseError('Failed to access data', 'The task was not retrieved please try again')
      )
      throw new DatabaseError('Failed to access data', 'The task was not retrieved please try again')
    }
  },
  get: async function (taskId: Types.ObjectId): Promise<ITask> {
    try {
      const res = await dbModel.findOne({ _id: taskId }).lean<ITask>()
      if (res == null) throw new NotFound('Task not found')
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
