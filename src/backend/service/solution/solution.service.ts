import { Types } from 'mongoose'
import model from './../../model/solution/model'
import { Request, Response } from 'express'
import { Forbidden, UserBadRequest } from '../../error/error'
import validator from '../../validator/validator'
import taskModel from './../../model/task/model'
import { ISolution } from '../../interface/solution'

/*
Auth middleware guarantees this:
  1. groupId
  2. accessToken at req.body?.accessToken
  3. User belongs to the group
  4. The user have the required role to the operation
  5. role at req.body.role
 */

const service = {
  get: async function (req: Request, res: Response): Promise<ISolution> {
    // body = taskId
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')
    return await model.get(req.body?.taskId) as ISolution
  },
  create: async function (req: Request, res: Response): Promise<Types.ObjectId> {
    // body = groupId, taskId, data: { feature, code, description }
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

    // first we need to verify the task is assign to the user
    const taskUsers = await taskModel.get(req.body?.taskId, { user: 1 })
    if (taskUsers.user === undefined) throw new Forbidden('Access denied', 'You can not create a solution to the task because no one is assign to it')
    const isAssign = taskUsers.user.find((account) => req.body?.accessToken?.account === account)
    if (isAssign === undefined) throw new Forbidden('Access denied', 'You can not create a solution to this task')

    const solution = validator.solution.create({
      ...req.body.data, // CODE, FEATURE, DESCRIPTION
      _id: req.body.taskId,
      groupId: req.body?.groupId
    })

    await taskModel.update(req.body?.taskId, { isComplete: true })

    return await model.create({ ...solution, user: req.body?.accessToken?.account } as unknown as ISolution)
  },
  update: async function (req: Request, res: Response): Promise<boolean> {
    // body = groupId, taskId, data: {code, feature, description}
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

    const data = validator.solution.partial(req.body.data)
    if (data === undefined) throw new UserBadRequest('Missing data', 'You did not send any data to update')

    if (req.body?.role !== 'techLead') {
      const isOwner = await model.get(req.body?.taskId, { user: 1 })
      if (isOwner.user !== req.body?.accessToken?.account) throw new Forbidden('Access denied', 'You can not update a solution you did not created')
    }

    return await model.update(req.body?.taskId, data)
  },
  delete: async function (req: Request, res: Response): Promise<boolean> {
    // body = taskId, groupId
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

    if (req.body.role !== 'techLead') {
      const isOwner = await model.get(req.body?.taskId, { user: 1 })
      if (isOwner.user !== req.body?.accessToken?.account) throw new Forbidden('Access denied', 'You can not delete a solution you did not created')
    }

    return await model.delete(req.body?.taskId)
  }
}

export default service
