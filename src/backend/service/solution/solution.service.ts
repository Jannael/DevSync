import { Types } from 'mongoose'
import model from './../../model/solution/model'
import { Request, Response } from 'express'
import { UserBadRequest } from '../../error/error'
import validator from '../../validator/validator'

const service = {
  get: async function (req: Request, res: Response) {
    if (req.body?.taskId === undefined) throw new UserBadRequest('Missing data', 'You need to send the taskId')
    if (!Types.ObjectId.isValid(req.body?.taskId)) throw new UserBadRequest('Invalid credentials', 'taskId is invalid')
    return await model.get(req.body?.taskId)
  },
  create: async function (req: Request, res: Response) {
    // first we need to verify the task is assign to the user

  },
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {}
}

export default service
