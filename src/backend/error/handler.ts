import { Response } from 'express'
import { CustomError } from './error'

function jwtHandler (e: CustomError):
{ code: number, msg: string, description: string, link: Array<{ rel: string, href: string }> | undefined } {
  const status = { code: 500, msg: '', description: '', link: e.link }

  if (e.name === 'TokenExpiredError') {
    status.code = 401
    status.msg = 'Expired token'
    status.description = 'The token has expired and is no longer valid'
  } else if (e.name === 'JsonWebTokenError') {
    status.code = 400
    status.msg = 'Invalid token'
    status.description = 'The token is malformed or has been tampered with'
  } else if (e.name === 'NotBeforeError') {
    status.code = 403
    status.msg = 'Invalid token'
    status.description = 'The token is not active yet; check the "nbf" claim'
  }

  return status
}

const handler = {
  user: function (res: Response, e: CustomError) {
    let status: {
      code: number
      msg: string
      description: string | undefined
      link: Array<{ rel: string, href: string }> | undefined
    } = { code: 500, msg: '', description: '', link: undefined }

    status.code = e.code
    status.msg = e.message
    status.description = e.description
    status.link = e.link

    status = jwtHandler(e)

    res.status(status.code).json({
      complete: false,
      msg: status.msg,
      description: status.description,
      link: status.link
    })
  }
}

export default handler
