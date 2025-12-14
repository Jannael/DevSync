import { Request, Response } from 'express'
import service from '../../service/solution/solution.service'
import handler from '../../error/handler'
import { CustomError } from '../../error/error'

const controller = {
  get: async function (req: Request, res: Response) {
    try {

    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  create: async function (req: Request, res: Response) {
    try {

    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  update: async function (req: Request, res: Response) {
    try {

    } catch (e) {
      handler.user(res, e as CustomError)
    }
  },
  delete: async function (req: Request, res: Response) {
    try {

    } catch (e) {
      handler.user(res, e as CustomError)
    }
  }

}

export default controller
