import { Response } from 'express'
import { DatabaseError, DuplicateData, UserBadRequest } from './error'

const handler = {
  user: function (res: Response, e: Error) {
    if (e instanceof DatabaseError) {
      res.status(500).json({ complete: false, msg: 'something went wrong, please try again' })
    } else if (e instanceof DuplicateData) {
      res.status(409).json({ complete: false, msg: 'User already exists' })
    } else if (e instanceof UserBadRequest) {
      res.status(400).json({ complete: false, msg: 'invalid or missing data' })
    }
    res.status(500).json({ complete: false })
  },
  merge: function (res: Response, e: Error) {
    if (e instanceof DatabaseError) {
      res.status(500).json({ complete: false, msg: 'something went wrong, please try again' })
    } else if (e instanceof DuplicateData) {
      res.status(409).json({ complete: false, msg: 'User already exists' })
    } else if (e instanceof UserBadRequest) {
      res.status(400).json({ complete: false, msg: 'invalid or missing data' })
    }
    res.status(500).json({ complete: false })
  }
}

export default handler
