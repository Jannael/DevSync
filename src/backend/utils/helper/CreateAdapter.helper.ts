import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import type { CustomError } from '../../error/Error.constructor'
import ErrorHandler from '../../error/Error.handler'

function CreateAdapter({
	controller,
	link,
	options,
}: {
	controller: (req: Request, res: Response) => unknown
	link?: Array<{ rel: string; href: string }>
	options?: { useTransaction?: boolean }
}) {
	return async (req: Request, res: Response) => {
		const { useTransaction } = options ?? {}
		const session = useTransaction ? await mongoose.startSession() : undefined

		try {
			let result: unknown
			if (useTransaction) {
				await session?.withTransaction(async () => {
					result = await controller(req, res)
				})
			} else {
				result = await controller(req, res)
			}

			if (typeof result === 'boolean') {
				res.json({ success: result })
			} else {
				res.json({ success: true, data: result })
			}
		} catch (e) {
			;(e as CustomError).link = link

			ErrorHandler.Response({ res, error: e as CustomError })
		} finally {
			if (useTransaction) await session?.endSession()
		}
	}
}

export default CreateAdapter
