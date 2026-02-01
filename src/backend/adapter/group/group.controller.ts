import type { Request, Response } from 'express'
import service from '../../controller/group/group.service'
import type { CustomError } from '../../error/error'
import ErrorHandler from '../../error/handler'

const controller = {
	get: async (req: Request, res: Response) => {
		try {
			const result = await service.get(req, res)
			res.json({ success: true, result })
		} catch (e) {
			ErrorHandler.user(res, e as CustomError)
		}
	},
	create: async (req: Request, res: Response) => {
		try {
			const result = await service.create(req, res)
			res.json({ success: true, result })
		} catch (e) {
			ErrorHandler.user(res, e as CustomError)
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			const result = await service.update(req, res)
			res.json({ success: true, result })
		} catch (e) {
			ErrorHandler.user(res, e as CustomError)
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const result = await service.delete(req, res)
			res.json({ success: result })
		} catch (e) {
			ErrorHandler.user(res, e as CustomError)
		}
	},
	member: {
		remove: async (req: Request, res: Response) => {
			try {
				const result = await service.member.remove(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		update: {
			role: async (req: Request, res: Response) => {
				try {
					const result = await service.member.update.role(req, res)
					res.json({ success: result })
				} catch (e) {
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
	},
}

export default controller
