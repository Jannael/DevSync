import { UserBadRequest } from '../../error/error'
import model from './../../model/task/model'
import { Request, Response } from 'express'

const service = {
  list: async function (req: Request, res: Response) {
    if (req.body?.pagination === undefined) throw new UserBadRequest('Missing data', 'You need to send the pagination field')
    if (typeof req.body?.pagination !== 'number') throw new UserBadRequest('Invalid credentials', 'Pagination field must be a number')

    return await model.list(req.body?.groupId, req.body?.accessToken.account, req.body?.pagination)
  },
  get: async function (req: Request, res: Response) {},
  create: async function (req: Request, res: Response) {},
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {}
}

export default service
