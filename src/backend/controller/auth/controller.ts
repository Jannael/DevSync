import { Request, Response } from 'express'
import fn from '../../functions/auth/function'

const controller = {
  request: {
    code: async function (req: Request, res: Response) {
      const result = await fn.request.code(req, res)
      if (result.complete) res.json({ complete: true })
      res.status(400).json({ complete: false, error: 'something went wrong' })
    },
    accessToken: async function (req: Request, res: Response) {
      const result = await fn.request.accessToken(req, res)
      if (result.complete) res.json({ complete: true })
      res.status(405).json({ complete: false })
    }
  },
  verify: {
    code: async function (req: Request, res: Response) {
      const result = await fn.verify.code(req, res)
      if (result.complete) res.json({ complete: true })
      res.json({ complete: false })
    },
    refreshToken: async function () {}
  }
}

export default controller
