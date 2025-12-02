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
  create: async function (req: Request, res: Response) {
    try {
      const result = await fn.create(req, res)
      res.json({ complete: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const result = await fn.update(req, res)
      res.json({ complete: true, result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const result = await fn.delete(req, res)
      res.json({ complete: result })
    } catch (e) {
      ErrorHandler.user(res, e as CustomError)
    }
  },
  member: {
    remove: async function (req: Request, res: Response) {
      try {
        const result = await fn.member.remove(req, res)
        res.json({ complete: result })
      } catch (e) {
        ErrorHandler.user(res, e as CustomError)
      }
    },
    update: {
      role: async function (req: Request, res: Response) {
        try {
          const result = await fn.member.update.role(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as CustomError)
        }
      }
    }
  }
}

export default controller
