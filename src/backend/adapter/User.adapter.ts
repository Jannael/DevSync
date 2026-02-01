import type { Request, Response } from 'express'
import service from '../../controller/User.controller'
import type { CustomError } from '../../error/error'
import ErrorHandler from '../../error/handler'

const controller = {
	get: async (req: Request, res: Response) => {
		try {
			const result = await service.get(req, res)
			res.json({ success: true, result })
		} catch (e) {
			;(e as CustomError).link = [
				{ rel: 'get accessToken', href: '/auth/v1/request/accessToken/' },
			]
			ErrorHandler.user(res, e as CustomError)
		}
	},
	create: async (req: Request, res: Response) => {
		try {
			const result = await service.create(req, res)
			res.json({ success: true, result })
		} catch (e) {
			;(e as CustomError).link = [
				{ rel: 'code', href: '/auth/v1/request/code/' },
				{ rel: 'code', href: '/auth/v1/verify/code/' },
			]
			ErrorHandler.user(res, e as CustomError)
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			const result = await service.update(req, res)
			res.json({ success: true, result })
		} catch (e) {
			;(e as CustomError).link = [
				{ rel: 'code', href: '/auth/v1/request/code/' },
				{ rel: 'code', href: '/auth/v1/verify/code/' },
			]
			ErrorHandler.user(res, e as CustomError)
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const result = await service.delete(req, res)
			res.json({ success: result })
		} catch (e) {
			;(e as CustomError).link = [
				{ rel: 'code', href: '/auth/v1/request/code/' },
				{ rel: 'code', href: '/auth/v1/verify/code/' },
			]
			ErrorHandler.user(res, e as CustomError)
		}
	},
	account: {
		update: async (req: Request, res: Response) => {
			try {
				const result = await service.account.update(req, res)
				res.json({ success: true, result })
			} catch (e) {
				;(e as CustomError).link = [
					{ rel: 'code', href: '/auth/v1/account/request/code/' },
					{ rel: 'code', href: '/auth/v1/account/verify/code/' },
				]
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
	password: {
		update: async (req: Request, res: Response) => {
			try {
				const result = await service.password.update(req, res)
				res.json({ success: result })
			} catch (e) {
				;(e as CustomError).link = [
					{ rel: 'code', href: '/auth/v1/password/request/code/' },
					{ rel: 'verify', href: '/auth/v1/password/verify/code/' },
				]
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
	invitation: {
		get: async (req: Request, res: Response) => {
			try {
				const result = await service.invitation.get(req, res)
				res.json({ success: true, result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		create: async (req: Request, res: Response) => {
			try {
				const result = await service.invitation.create(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		reject: async (req: Request, res: Response) => {
			try {
				const result = await service.invitation.reject(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		accept: async (req: Request, res: Response) => {
			try {
				const result = await service.invitation.accept(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
	group: {
		get: async (req: Request, res: Response) => {
			try {
				const result = await service.group.get(req, res)
				res.json({ success: true, result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		remove: async (req: Request, res: Response) => {
			try {
				const result = await service.group.remove(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		add: async (req: Request, res: Response) => {
			try {
				const result = await service.group.add(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
}

export default controller
