import { Request, Response } from 'express'
import functions from '../../function/user/function'
import ErrorHandler from '../../error/handler'

const controller = {
  user: {
    get: {

    },
    create: async function (req: Request, res: Response) {
      try {
        const result = await functions.create.user(req, res)

        if (result instanceof Error) { throw result }

        const { fullName, account, nickName, role, personalization } = result
        res.json({ fullName, account, nickName, role, personalization })
      } catch (e) {
        ErrorHandler.user(res, e as Error)
      }
    },
    update: {

    },
    delete: {

    }

  }
}

export default controller
