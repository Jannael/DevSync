import type { Request, Response } from 'express'
import type { CustomError } from '../../error/error'
import ErrorHandler from './../../error/handler'
import service from '../../service/auth/auth.service'

const controller = {
	request: {
		code: async (req: Request, res: Response) => {
			try {
				const result = await service.request.code(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
		accessToken: async (req: Request, res: Response) => {
			try {
				const result = await service.request.accessToken(req, res)
				res.json({ success: result })
			} catch (e) {
				;(e as CustomError).link = [
					{
						rel: 'Code for login',
						href: '/auth/v1/request/refreshToken/code/',
					},
					{
						rel: 'Verify code for login',
						href: '/auth/v1/request/refreshToken/',
					},
				]

				ErrorHandler.user(res, e as CustomError)
			}
		},
		refreshToken: {
			code: async (req: Request, res: Response) => {
				try {
					const result = await service.request.refreshToken.code(req, res)
					res.json({ success: result })
				} catch (e) {
					ErrorHandler.user(res, e as CustomError)
				}
			},
			confirm: async (req: Request, res: Response) => {
				try {
					const result = await service.request.refreshToken.confirm(req, res)
					res.json({ success: result })
				} catch (e) {
					;(e as CustomError).link = [
						{
							rel: 'You need to use MFA for login',
							href: '/auth/v1/request/refreshToken/code/',
						},
					]
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
		logout: async (req: Request, res: Response) => {
			try {
				const result = await service.request.logout(req, res)
				res.json({ success: result })
			} catch (e) {
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
	verify: {
		code: async (req: Request, res: Response) => {
			try {
				const result = await service.verify.code(req, res)
				res.json({ success: result })
			} catch (e) {
				;(e as CustomError).link = [
					{ rel: 'Missing code', href: '/auth/v1/request/code' },
				]
				ErrorHandler.user(res, e as CustomError)
			}
		},
	},
	account: {
		request: {
			code: async (req: Request, res: Response) => {
				try {
					const result = await service.account.request.code(req, res)
					res.json({ success: result })
				} catch (e) {
					;(e as CustomError).link = [
						{
							rel: 'get accessToken with refreshToken',
							href: '/auth/v1/request/accessToken/',
						},
						{
							rel: 'get refreshToken',
							href: '/auth/v1/request/refreshToken/code',
						},
						{ rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/' },
					]
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
		verify: {
			code: async (req: Request, res: Response) => {
				try {
					const result = await service.account.verify.code(req, res)
					res.json({ success: result })
				} catch (e) {
					;(e as CustomError).link = [
						{
							rel: 'get accessToken with refreshToken',
							href: '/auth/v1/request/accessToken/',
						},
						{
							rel: 'get refreshToken',
							href: '/auth/v1/request/refreshToken/code',
						},
						{ rel: 'get refreshToken', href: '/auth/v1/request/refreshToken/' },
						{
							rel: 'get verification code for account change',
							href: '/auth/v1/account/request/code/',
						},
						{ rel: 'validate code', href: '/auth/v1/account/verify/code/' },
					]
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
	},
	pwd: {
		request: {
			code: async (req: Request, res: Response) => {
				try {
					const result = await service.pwd.request.code(req, res)
					res.json({ success: result })
				} catch (e) {
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
		verify: {
			code: async (req: Request, res: Response) => {
				try {
					const result = await service.pwd.verify.code(req, res)
					res.json({ success: result })
				} catch (e) {
					;(e as CustomError).link = [
						{ rel: 'get code', href: '/auth/v1/password/request/code/' },
					]
					ErrorHandler.user(res, e as CustomError)
				}
			},
		},
	},
}

export default controller
