import { Response } from 'express'
import { DatabaseError, DuplicateData, NotFound, UserBadRequest } from './error'

const handler = {
  user: function (res: Response, e: Error) {
    let status = 500
    if (e instanceof DatabaseError) status = 500
    else if (e instanceof DuplicateData) status = 409
    else if (e instanceof UserBadRequest) {
      status = 400
      if (e.message === 'account not verified') status = 403
    } else if (e instanceof NotFound) status = 404

    res.status(status).json({ complete: false, msg: e.message })
  },
  merge: function (res: Response, e: Error) {
    if (e instanceof DatabaseError) {
      res.status(500).json({ complete: false, msg: 'something went wrong, please try again' })
    } else if (e instanceof DuplicateData) {
      res.status(409).json({ complete: false, msg: 'User already exists' })
    } else if (e instanceof UserBadRequest) {
      if (e.message === 'account not verified') {
        res.status(403).json({ complete: false, msg: 'account not verified' })
      }
      res.status(400).json({ complete: false, msg: 'invalid or missing data' })
    }
    res.status(500).json({ complete: false })
  }
}

export default handler
