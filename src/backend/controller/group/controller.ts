import { Request, Response } from 'express'
import fn from '../../function/group/function'
import ErrorHandler from '../../error/handler'
import { CustomError } from '../../error/error'

const controller = {
  get: async function (req: Request, res: Response) {
    try {
      const result = await fn.get(req, res)
      res.json({ complete: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  create: async function (req: Request, res: Response) {},
  update: async function (req: Request, res: Response) {},
  delete: async function (req: Request, res: Response) {},
  member: {
    remove: async function (req: Request, res: Response) {}
  }
}

export default controller
