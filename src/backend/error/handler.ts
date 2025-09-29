import { Response } from 'express'
import { DatabaseError, DuplicateData, NotFound, UserBadRequest } from './error'

const handler = {
  user: function (res: Response, e: Error) {
    const status = { code: 500, msg: '' }
    if (e instanceof DatabaseError) {
      status.code = 500
      status.msg = e.message
    } else if (e instanceof DuplicateData) {
      status.code = 409
      status.msg = e.message
    } else if (e instanceof UserBadRequest) {
      status.code = 400
      if (e.message === 'account not verified') status.code = 403
      status.msg = e.message
    } else if (e instanceof NotFound) {
      status.code = 404
      status.msg = e.message
    }

    res.status(status.code).json({ complete: false, msg: status.msg })
  }
}

export default handler
