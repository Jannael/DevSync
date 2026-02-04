import type { Request, Response } from 'express'
import type { CustomError } from '../../error/Error.constructor'
import ErrorHandler from '../../error/Error.handler'

function CreateAdapter({
	controller,
	link,
}: {
	controller: (req: Request, res: Response) => unknown
	link?: Array<{ rel: string; href: string }>
}) {
	return async (req: Request, res: Response) => {
		try {
			const result = await controller(req, res)
			if (typeof result === 'boolean') {
				res.json({ success: result })
			} else {
				res.json({ success: true, data: result })
			}
		} catch (e) {
			;(e as CustomError).link = link

			ErrorHandler.Response({ res, error: e as CustomError })
		}
	}
}

export default CreateAdapter
