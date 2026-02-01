import type { Response } from 'express'
import type { CustomError } from './Error.constructor'
import {
	DatabaseError,
	DuplicateData,
	Forbidden,
	NotFound,
	ServerError,
	UserBadRequest,
} from './Error.instances'
import JwtErrorHandler from './Jwt.handler'

const ErrorHandler = {
	Response: (res: Response, e: CustomError) => {
		let status: {
			code: number
			msg: string
			description: string | undefined
			link: Array<{ rel: string; href: string }> | undefined
		} = { code: 500, msg: '', description: '', link: undefined }

		status.code = e.code
		status.msg = e.message
		status.description = e.description
		status.link = e.link

		const jwtError = JwtErrorHandler(e)
		if (jwtError !== undefined) status = jwtError

		res.status(status.code).json({
			success: false,
			msg: status.msg,
			description: status.description,
			link: status.link,
		})
	},
	Model: (e: CustomError, lastError: CustomError) => {
		if (e instanceof DatabaseError) throw e
		else if (e instanceof UserBadRequest) throw e
		else if (e instanceof DuplicateData) throw e
		else if (e instanceof NotFound) throw e
		else if (e instanceof ServerError) throw e
		else if (e instanceof Forbidden) throw e

		throw lastError
	},
}

export default ErrorHandler
