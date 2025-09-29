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
        ErrorHandler.user(res, e as Error)
      }
    },
    create: async function (req: Request, res: Response) {
      try {
        const result = await fn.user.create(req, res)

        if (result instanceof Error) { throw result }

        const { fullName, account, nickName, role, personalization } = result
        res.json({ fullName, account, nickName, role, personalization })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    update: async function (req: Request, res: Response) {

    },
    delete: async function (req: Request, res: Response) {

    }

  }
}

export default controller
