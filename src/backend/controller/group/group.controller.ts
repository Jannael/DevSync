import { Request, Response } from 'express'
import service from '../../service/group/group.service'
import ErrorHandler from '../../error/handler'
import { CustomError } from '../../error/error'

const controller = {
  get: async function (req: Request, res: Response) {
    try {
      const result = await service.get(req, res)
      res.json({ success: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  create: async function (req: Request, res: Response) {
    try {
      const result = await service.create(req, res)
      res.json({ success: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const result = await service.update(req, res)
      res.json({ success: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const result = await service.delete(req, res)
      res.json({ success: result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  member: {
    remove: async function (req: Request, res: Response) {
      try {
        const result = await service.member.remove(req, res)
        res.json({ success: result })
      } catch (e) {
        ErrorHandler.user(res, e as CustomError)
      }
    },
    update: {
      role: async function (req: Request, res: Response) {
        try {
          const result = await service.member.update.role(req, res)
          res.json({ success: result })
        } catch (e) {
          ErrorHandler.user(res, e as CustomError)
        }
      }
    }
  }
}

export default controller
