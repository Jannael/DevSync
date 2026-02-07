import type { Request, Response } from 'express'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import type { CustomError } from '../../error/Error.constructor'
import ErrorHandler from '../../error/Error.handler'

function CreateAdapter({
	controller,
	link,
	options,
}: {
	controller: (req: Request, res: Response, session?: ClientSession) => unknown
	link?: Array<{ rel: string; href: string }>
	options?: { transaction?: boolean }
}) {
	return async (req: Request, res: Response) => {
		const { transaction } = options || {}

		const session = transaction ? await mongoose.startSession() : undefined
		transaction && session?.startTransaction()

		try {
			const result = await controller(req, res, session)
			transaction && session?.commitTransaction()
			if (typeof result === 'boolean') {
				res.json({ success: result })
			} else {
				res.json({ success: true, data: result })
			}
		} catch (e) {
			transaction && session?.abortTransaction()
			;(e as CustomError).link = link

			ErrorHandler.Response({ res, error: e as CustomError })
		} finally {
			transaction && session?.endSession()
		}
	}
}

export default CreateAdapter
