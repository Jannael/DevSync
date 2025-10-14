import { Request, Response } from 'express'
import fn from '../../function/user/function'
import ErrorHandler from '../../error/handler'

const controller = {
  user: {
    get: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.get(req, res)
        result.complete = true
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
        res.status(201).json({ ...result, complete: true })
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'code', href: '/auth/v1/request/code/' },
          { rel: 'code', href: '/auth/v1/verify/code/' }
        ])
      }
    },
    update: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.update(req, res)
        res.json({ complete: true, user: result })
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'code', href: '/auth/v1/request/code/' },
          { rel: 'code', href: '/auth/v1/verify/code/' }
        ])
      }
    },
    delete: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.delete(req, res)
        if (result) res.json({ complete: true })
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'code', href: '/auth/v1/request/code/' },
          { rel: 'code', href: '/auth/v1/verify/code/' }
        ])
      }
    },
    account: {
      update: async function (req: Request, res: Response) {
        try {
          const result = await fn.user.account.update(req, res)
          res.json({ complete: true, user: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error, [
            { rel: 'code', href: '/auth/v1/account/request/code/' },
            { rel: 'code', href: '/auth/v1/account/verify/code/' }
          ])
        }
      }
    },
    password: {
      update: async function (req: Request, res: Response) {
        try {
          const result = await fn.user.password.update(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error, [
            { rel: 'code', href: '/auth/v1/password/request/code/' },
            { rel: 'verify', href: '/auth/v1/password/verify/code/' }
          ])
        }
      }
    }
  }
}

export default controller
