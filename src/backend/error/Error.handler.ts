import type { Response } from 'express'
import type { IErrorResponse } from '../interface/ErrorResponse'
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
	Response: ({ res, error }: { res: Response; error: CustomError }) => {
		let ErrorResponse: IErrorResponse = {
			success: false,
			code: 500,
			msg: '',
			description: '',
			link: undefined,
		} // default error response

		ErrorResponse.code = error.code
		ErrorResponse.msg = error.message
		ErrorResponse.description = error.description
		ErrorResponse.link = error.link

		const jwtError = JwtErrorHandler(error)
		if (jwtError !== undefined) ErrorResponse = { ...jwtError, success: false }

		res.status(ErrorResponse.code).json({
			success: ErrorResponse.success,
			msg: ErrorResponse.msg,
			description: ErrorResponse.description,
			link: ErrorResponse.link,
		})
	},
	Model: ({
		error,
		DefaultError,
	}: {
		error: CustomError
		DefaultError: CustomError
	}) => {
		if (error instanceof DatabaseError) throw error
		else if (error instanceof UserBadRequest) throw error
		else if (error instanceof DuplicateData) throw error
		else if (error instanceof NotFound) throw error
		else if (error instanceof ServerError) throw error
		else if (error instanceof Forbidden) throw error

		throw DefaultError
	},
}

export default ErrorHandler
