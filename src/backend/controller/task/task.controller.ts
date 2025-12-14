import { Request, Response } from 'express'
import handler from '../../error/handler'
import { CustomError } from '../../error/error'
import service from '../../service/task/task.service'

const controller = {
  list: async function (req: Request, res: Response) {
    try {
      const result = await service.list(req, res)
      res.json({ success: true, result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  get: async function (req: Request, res: Response) {
    try {
      const result = await service.get(req, res)
      res.json({ success: true, result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  create: async function (req: Request, res: Response) {
    try {
      const result = await service.create(req, res)
      res.json({ success: true, result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const result = await service.update(req, res)
      res.json({ success: result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const result = await service.delete(req, res)
      res.json({ success: result })
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  }
}

export default controller
