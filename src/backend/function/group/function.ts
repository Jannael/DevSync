import { UserBadRequest } from '../../error/error'
import { Request, Response } from 'express'
import model from './../../model/group/model'
import { IGroup } from '../../interface/group'

const functions = {
  get: async function (req: Request, res: Response): Promise<IGroup> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the group you want')
    return await model.get(req.body._id)
  },
  create: async function (req: Request, res: Response) {},
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {},
  member: {
    add: async function (req: Request, res: Response) {},
    remove: async function (req: Request, res: Response) {}
  }

}

export default functions
