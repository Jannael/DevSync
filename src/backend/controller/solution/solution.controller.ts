import { Request, Response } from 'express'
import service from '../../service/solution/solution.service'
import handler from '../../error/handler'
import { CustomError } from '../../error/error'

const controller = {
  get: async function (req: Request, res: Response) {
    try {
      const result = await service.get(req, res)
      res.json({ complete: true, result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  create: async function (req: Request, res: Response) {
    try {
      const result = await service.create(req, res)
      res.json({ complete: true, result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const result = await service.update(req, res)
      res.json({ complete: result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const result = await service.delete(req, res)
      res.json({ complete: result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  }

}

export default controller
