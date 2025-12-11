import { Types } from 'mongoose'
import { UserBadRequest } from '../../error/error'
import { IListTask, ITask } from '../../interface/task'
import model from './../../model/task/model'
import { Request, Response } from 'express'
import validator from '../../validator/validator'
import authModel from './../../model/auth/model'
import groupModel from './../../model/group/model'

const service = {
  list: async function (req: Request, res: Response): Promise<IListTask> {
    if (req.body?.pagination === undefined) throw new UserBadRequest('Missing data', 'You need to send the pagination field')
    if (typeof req.body?.pagination !== 'number') throw new UserBadRequest('Invalid credentials', 'Pagination field must be a number')

    return await model.list(req.body?.groupId, req.body?.accessToken.account, req.body?.pagination)
  },
  get: async function (req: Request, res: Response): Promise<ITask> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the task you want')
    if (!Types.ObjectId.isValid(req.body?._id)) throw new UserBadRequest('Invalid credentials', 'The _id for the task is invalid')
    return await model.get(req.body?._id)
  },
  create: async function (req: Request, res: Response): Promise<Types.ObjectId> {
    const task = validator.task.create(req.body)

    for (const userAccount of task.user) {
      await authModel.exists(userAccount)
    }

    return await model.create(task)
  },
  update: async function (req: Request, res: Response): Promise<boolean> {
    // body = groupId, taskId, data = {...}
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'The taskId is invalid')

    const task = validator.task.partial(req.body.data)

    if (task.user !== undefined) {
      for (const userAccount of task.user) {
        await authModel.exists(userAccount)
        await groupModel.member.exists(userAccount, req.body?.groupId)
      }
    }

    return await model.update(req.body?.taskId, task)
  },
  delete: async function (req: Request, res: Response): Promise<boolean> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the task you want to delete')
    if (!Types.ObjectId.isValid(req.body?._id)) throw new UserBadRequest('Invalid credentials', 'The _id for the task is invalid')

    return await model.delete(req.body?._id)
  }
}

export default service
