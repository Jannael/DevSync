import { Types } from 'mongoose'
import model from './../../model/solution/model'
import { Request, Response } from 'express'
import { Forbidden, UserBadRequest } from '../../error/error'
import validator from '../../validator/validator'
import taskModel from './../../model/task/model'
import { ISolution } from '../../interface/solution'

const service = {
  get: async function (req: Request, res: Response) {
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')
    return await model.get(req.body?.taskId)
  },
  create: async function (req: Request, res: Response) {
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

    // first we need to verify the task is assign to the user
    const taskUsers = await taskModel.get(req.body?.taskId, { user: 1 })
    if (taskUsers.user === undefined) throw new Forbidden('Access denied', 'You can not create a solution to the task because no one is assign to it')
    const isAssign = taskUsers.user.find((account) => req.body?.accessToken?.account === account)
    if (isAssign === undefined) throw new Forbidden('Access denied', 'You can not create a solution to this task')

    const solution = validator.solution.create({ ...req.body.data, _id: req.body.taskId })
    return await model.create(solution as unknown as ISolution)
  },
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {}
}

export default service
