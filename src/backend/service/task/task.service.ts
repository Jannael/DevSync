import { Types } from 'mongoose'
import { Forbidden, UserBadRequest } from '../../error/error'
import { IListTask, ITask } from '../../interface/task'
import model from './../../model/task/model'
import { Request, Response } from 'express'
import validator from '../../validator/validator'
import authModel from './../../model/auth/model'
import groupModel from './../../model/group/model'
import { verifyEmail } from '../../utils/utils'

/*
Auth middleware guarantees this:
  1. groupId
  2. accessToken at req.body?.accessToken
  3. User belongs to the group
  4. The user have the required role to the operation
  5. role at req.body.role
 */

const service = {
  list: async function (req: Request, res: Response): Promise<IListTask> {
    if (req.body?.pagination === undefined) throw new UserBadRequest('Missing data', 'You need to send the pagination field')
    if (typeof req.body?.pagination !== 'number') throw new UserBadRequest('Invalid credentials', 'Pagination field must be a number')

    return await model.list(req.body?.groupId, req.body?.accessToken.account, req.body?.pagination)
  },
  get: async function (req: Request, res: Response): Promise<ITask> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the task you want')
    if (!Types.ObjectId.isValid(req.body?._id)) throw new UserBadRequest('Invalid credentials', 'The _id for the task is invalid')

    const task = await model.get(req.body?._id) as ITask
    if (task.groupId.toString() !== req.body?.groupId) throw new Forbidden('Access denied', 'You can not get the task')

    return task
  },
  create: async function (req: Request, res: Response): Promise<Types.ObjectId> {
    const task = validator.task.create(req.body)

    if (task.user !== undefined) {
      for (const userAccount of task.user) {
        if (!verifyEmail(userAccount)) throw new UserBadRequest('Invalid credentials', `The account ${userAccount} is invalid`)
        await authModel.exists(userAccount)
      }
    }

    return await model.create(task as unknown as Omit<ITask, '_id'>)
  },
  update: async function (req: Request, res: Response): Promise<boolean> {
    // body = groupId, taskId, data = {...}
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'The taskId is invalid')

    const task = validator.task.partial(req.body.data)

    if (task.user !== undefined) {
      for (const userAccount of task.user) {
        if (!verifyEmail(userAccount)) throw new UserBadRequest('Invalid credentials', `The account ${userAccount} is invalid`)
        await authModel.exists(userAccount)
        await groupModel.member.exists(userAccount, req.body?.groupId)
      }
    }

    const guard = await model.get(req.body.taskId, { groupId: 1 })
    if (guard.groupId?.toString() !== req.body?.groupId) throw new Forbidden('Access denied', 'You can not update the task')

    return await model.update(req.body?.taskId, task as Partial<ITask>)
  },
  delete: async function (req: Request, res: Response): Promise<boolean> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the task you want to delete')
    if (!Types.ObjectId.isValid(req.body?._id)) throw new UserBadRequest('Invalid credentials', 'The _id for the task is invalid')

    const guard = await model.get(req.body._id, { groupId: 1 })
    if (guard.groupId?.toString() !== req.body?.groupId) throw new Forbidden('Access denied', 'You can not update the task')

    return await model.delete(req.body?._id)
  }
}

export default service
