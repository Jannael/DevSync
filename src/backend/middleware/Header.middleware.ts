import type { NextFunction, Request, Response } from 'express'

async function header(
	_: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	res.removeHeader('x-powered-by')
	next()
}

export default header
