import { Types } from 'mongoose'
import { UserBadRequest } from '../../error/error'
import { IListTask, ITask } from '../../interface/task'
import model from './../../model/task/model'
import { Request, Response } from 'express'

const service = {
  list: async function (req: Request, res: Response): Promise<IListTask> {
    if (req.body?.pagination === undefined) throw new UserBadRequest('Missing data', 'You need to send the pagination field')
    if (typeof req.body?.pagination !== 'number') throw new UserBadRequest('Invalid credentials', 'Pagination field must be a number')

    return await model.list(req.body?.groupId, req.body?.accessToken.account, req.body?.pagination)
  },
  get: async function (req: Request, res: Response): Promise<ITask> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You to send the _id for the task you want')
    if (!Types.ObjectId.isValid(req.body?._id)) throw new UserBadRequest('Invalid credentials', 'The _id for the task is invalid')
    return await model.get(req.body?._id)
  },
  create: async function (req: Request, res: Response) {},
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {}
}

export default service
