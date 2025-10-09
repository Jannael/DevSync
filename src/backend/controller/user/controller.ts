import { Request, Response } from 'express'
import fn from '../../function/user/function'
import ErrorHandler from '../../error/handler'

const controller = {
  user: {
    get: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.get(req, res)
        res.json(result)
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'get accessToken', href: '/auth/v1/request/accessToken/' }
        ])
      }
    },
    create: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.create(req, res)
        res.status(201).json(result)
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    update: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.update(req, res)
        res.json({ complete: true, user: result })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    delete: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.delete(req, res)
        if (result) res.json({ complete: true })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    account: {
      update: async function (req: Request, res: Response) {
        try {
          const result = await fn.user.account.update(req, res)
          res.json({ complete: true, user: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error)
        }
      }
    }
  }
}

export default controller
