import { Request, Response } from 'express'
import fn from '../../function/auth/function'
import ErrorHandler from './../../error/handler'

const controller = {
  request: {
    code: async function (req: Request, res: Response) {
      try {
        const result = await fn.request.code(req, res)
        res.json({ complete: result })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    accessToken: async function (req: Request, res: Response) {
      try {
        const result = await fn.request.accessToken(req, res)
        res.json({ complete: result })
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'Code for login', href: '' },
          { rel: 'Verify code for login', href: '' }
        ])
      }
    },
    refreshToken: {
      code: async function (req: Request, res: Response) {
        try {
          const result = await fn.request.refreshToken.code(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error)
        }
      },
      confirm: async function (req: Request, res: Response) {
        try {
          const result = await fn.request.refreshToken.confirm(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error, [
            { rel: 'You need to use MFA for login', href: '/auth/v1/request/refreshToken/code/' }
          ])
        }
      }
    }
  },
  verify: {
    code: async function (req: Request, res: Response) {
      try {
        const result = await fn.verify.code(req, res)
        res.json({ complete: result })
      } catch (e) {
        ErrorHandler.user(res, e as Error, [
          { rel: 'Missing code', href: '/auth/v1/request/code' }
        ])
      }
    }
  },
  account: {
    request: {
      code: async function (req: Request, res: Response) {
        try {
          const result = await fn.account.request.code(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error)
        }
      }
    },
    verify: {
      code: async function (req: Request, res: Response) {
        try {
          const result = await fn.account.verify.code(req, res)
          res.json({ complete: result })
        } catch (e) {
          ErrorHandler.user(res, e as Error)
        }
      }
    }
  }
}

export default controller
