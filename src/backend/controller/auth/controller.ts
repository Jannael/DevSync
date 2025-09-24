import { Request, Response } from 'express'
import fn from '../../functions/auth/function'

const controller = {
  request: {
    code: async function (req: Request, res: Response) {
      const result = await fn.request.code(req, res)
      if (result.complete) res.json({ complete: true })
      res.status(400).json({ complete: false, error: 'something went wrong' })
    },
    accessToken: async function () {

    }
  },
  verify: {
    code: async function () {},
    refreshToken: async function () {}
  }
}

export default controller
