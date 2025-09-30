import { Request, Response } from 'express'
import fn from '../../function/auth/function'
import ErrorHandler from './../../error/handler'

const controller = {
  request: {
    code: async function (req: Request, res: Response) {
      try {
        const result = await fn.request.code(req, res)
        if (result.complete) res.json({ complete: true })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    accessToken: async function (req: Request, res: Response) {
      try {
        const result = await fn.request.accessToken(req, res)
        if (result.complete) res.json({ complete: true })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    refreshToken: async function (req: Request, res: Response) {
      try {
        const result = await fn.request.refreshToken(req, res)
        if (!result.complete) res.json({ complete: false })
        res.json(result)
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    }
  },
  verify: {
    code: async function (req: Request, res: Response) {
      try {
        const result = await fn.verify.code(req, res)
        if (result.complete) res.json({ complete: true })
        res.json({ complete: false })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    }
  },
  account: {
    request: {
      code: async function (req: Request, res: Response) {
        try {
          const result = await fn.account.request.code(req, res)
          if (result.complete) res.json({ complete: true })
          res.json({ complete: false })
        } catch (e) { ErrorHandler.user(res, e as Error) }
      }
    },
    verify: {
      code: async function (req: Request, res: Response) {

      }
    }
  }
}

export default controller
