import type { CustomError } from './Error.constructor'

function JwtErrorHandler(e: CustomError):
	| {
			code: number
			msg: string
			description: string
			link: Array<{ rel: string; href: string }> | undefined
	  }
	| undefined {
	let isNull = true
	const status = {
		code: 500,
		msg: 'Server error',
		description: '',
		link: e.link,
	}

	if (e.name === 'TokenExpiredError') {
		isNull = false
		status.code = 401
		status.msg = 'Expired token'
		status.description = 'The token has expired and is no longer valid'
	} else if (e.name === 'JsonWebTokenError') {
		isNull = false
		status.code = 400
		status.msg = 'Invalid credentials'
		status.description = 'The token is malformed or has been tampered with'
	} else if (e.name === 'NotBeforeError') {
		isNull = false
		status.code = 403
		status.msg = 'Access denied'
		status.description = 'The token is not active yet; check the "nbf" claim'
	}

	if (isNull) {
		return undefined
	}
	return status
}
export default JwtErrorHandler
