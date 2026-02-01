import type { Request, Response } from 'express'
import service from '../../controller/Task.controller'
import type { CustomError } from '../../error/error'
import handler from '../../error/handler'

const controller = {
	list: async (req: Request, res: Response) => {
		try {
			const result = await service.list(req, res)
			res.json({ success: true, result })
		} catch (e) {
			handler.user(res, e as CustomError)
		}
	},
	get: async (req: Request, res: Response) => {
		try {
			const result = await service.get(req, res)
			res.json({ success: true, result })
		} catch (e) {
			handler.user(res, e as CustomError)
		}
	},
	create: async (req: Request, res: Response) => {
		try {
			const result = await service.create(req, res)
			res.json({ success: true, result })
		} catch (e) {
			handler.user(res, e as CustomError)
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			const result = await service.update(req, res)
			res.json({ success: result })
		} catch (e) {
			handler.user(res, e as CustomError)
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const result = await service.delete(req, res)
			res.json({ success: result })
		} catch (e) {
			handler.user(res, e as CustomError)
		}
	},
}

export default controller
