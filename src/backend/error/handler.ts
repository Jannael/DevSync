import { Response } from 'express'
import { DatabaseError, DuplicateData, NotFound, UserBadRequest } from './error'

const handler = {
  user: function (res: Response, e: Error, link?: Array<{ rel: string, href: string }>) {
    const status = { code: 500, msg: '', links: [] }

    if (e instanceof DatabaseError) {
      status.code = 500
      status.msg = e.message
    } else if (e instanceof DuplicateData) {
      status.code = 409
      status.msg = e.message
    } else if (e instanceof UserBadRequest) {
      status.code = 400
      if (e.message === 'Account not verified' ||
        e.message === 'Not authorized') status.code = 401
      else if (e.message === 'Forbidden') status.code = 403
      status.msg = e.message
    } else if (e instanceof NotFound) {
      status.code = 404
      status.msg = e.message
    } else if (e.name === 'TokenExpiredError') {
      status.code = 401
      status.msg = 'Expired token'
    } else if (e.name === 'JsonWebTokenError') {
      status.code = 400
      status.msg = 'Invalid token'
    } else if (e.name === 'NotBeforeError') {
      status.code = 403
      status.msg = 'Token it is not valid yet'
    } else if (e.message === 'Invalid initialization vector' && e.name === 'TypeError') {
      status.code = 400
      status.msg = 'Invalid token'
    }

    res.status(status.code).json({ complete: false, msg: status.msg, link })
  }
}

export default handler
