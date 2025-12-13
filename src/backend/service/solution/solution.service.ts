import { Types } from 'mongoose'
import model from './../../model/solution/model'
import { Request, Response } from 'express'
import { UserBadRequest } from '../../error/error'

const service = {
  get: async function (req: Request, res: Response) {
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')
    return await model.get(req.body?.taskId)
  },
  create: async function (req: Request, res: Response) {},
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {}
}

export default service
