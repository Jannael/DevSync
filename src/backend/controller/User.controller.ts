import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import config from '../../config/Config'
import authModel from '../../model/auth/Auth.model'
import groupModel from '../../model/group/Group.model'
import model from '../../model/user/User.model'
import {
	DatabaseError,
	Forbidden,
	UserBadRequest,
} from '../error/Error.constructor'
import type { IEnv } from '../interface/Env'
import type {
	IRefreshToken,
	IUser,
	IUserGroup,
	IUserInvitation,
} from '../interface/User'
import { encrypt } from '../utils/EncryptToken.utils'
import getToken from '../utils/GetToken.utils'
import { verifyEmail } from '../utils/Omit.utils'
import validator from '../validator/Merge.validator'

dotenv.config({ quiet: true })
const {
	JWT_ACCESS_TOKEN_ENV,
	JWT_REFRESH_TOKEN_ENV,
	JWT_AUTH_ENV,
	CRYPTO_ACCESS_TOKEN_ENV,
	CRYPTO_AUTH_ENV,
	CRYPTO_REFRESH_TOKEN_ENV,
} = process.env as Pick<
	IEnv,
	| 'JWT_ACCESS_TOKEN_ENV'
	| 'JWT_REFRESH_TOKEN_ENV'
	| 'JWT_AUTH_ENV'
	| 'CRYPTO_ACCESS_TOKEN_ENV'
	| 'CRYPTO_AUTH_ENV'
	| 'CRYPTO_REFRESH_TOKEN_ENV'
>

const service = {
	get: async (req: Request, _res: Response): Promise<IRefreshToken> => {
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		)

		delete accessToken.iat
		delete accessToken.exp
		delete accessToken._id

		return accessToken as IRefreshToken
	},
	create: async (req: Request, res: Response): Promise<IRefreshToken> => {
		if (req.body === undefined)
			throw new UserBadRequest(
				'Missing data',
				'You did not send any information',
			)

		const decoded = getToken(req, 'account', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)

		if (decoded.account !== req.body?.account)
			throw new UserBadRequest(
				'Invalid credentials',
				'Verified account does not match the sent account',
			)

		req.body.account = decoded.account

		const validData = validator.user.create(req.body)
		const result = await model.create(validData)

		const refreshToken = encrypt(
			result as unknown as Record<string, unknown>,
			CRYPTO_REFRESH_TOKEN_ENV,
			JWT_REFRESH_TOKEN_ENV,
			config.jwt.refreshToken,
		)
		const accessToken = encrypt(
			result as unknown as Record<string, unknown>,
			CRYPTO_ACCESS_TOKEN_ENV,
			JWT_ACCESS_TOKEN_ENV,
			config.jwt.accessToken,
		)

		res.cookie('refreshToken', refreshToken, config.cookies.refreshToken)
		res.cookie('accessToken', accessToken, config.cookies.accessToken)
		res.clearCookie('account')

		delete (result as IUser)._id

		return result
	},
	update: async (req: Request, res: Response): Promise<IRefreshToken> => {
		if (
			req.body?.account !== undefined ||
			req.body?.refreshToken !== undefined ||
			req.body?._id !== undefined
		)
			throw new UserBadRequest(
				'Invalid credentials',
				'You can not update _id, account, refreshToken',
			)

		const accountCookie = getToken(
			req,
			'account',
			JWT_AUTH_ENV,
			CRYPTO_AUTH_ENV,
		)
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		)
		if (accessToken.account !== accountCookie.account)
			throw new UserBadRequest(
				'Invalid credentials',
				'The account verified and your account does not match',
			)

		const data = validator.user.partial(req.body)
		if (data === null)
			throw new UserBadRequest(
				'Missing data',
				'No data to update or invalid data',
			)

		const result = await model.update(data, accessToken._id)
		const newRefreshToken = encrypt(
			result as unknown as Record<string, unknown>,
			CRYPTO_REFRESH_TOKEN_ENV,
			JWT_REFRESH_TOKEN_ENV,
			config.jwt.refreshToken,
		)
		const newAccessToken = encrypt(
			result as unknown as Record<string, unknown>,
			CRYPTO_ACCESS_TOKEN_ENV,
			JWT_ACCESS_TOKEN_ENV,
			config.jwt.accessToken,
		)

		const isSaved = await authModel.refreshToken.save(
			newRefreshToken,
			accessToken._id,
		)
		if (!isSaved)
			throw new DatabaseError(
				'Failed to save',
				'Something went wrong please try again',
			)

		res.cookie('refreshToken', newRefreshToken, config.cookies.refreshToken)
		res.cookie('accessToken', newAccessToken, config.cookies.accessToken)
		res.clearCookie('account')

		delete (result as IUser)._id
		return result
	},
	delete: async (req: Request, res: Response): Promise<boolean> => {
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		)
		const cookieAccount = getToken(
			req,
			'account',
			JWT_AUTH_ENV,
			CRYPTO_AUTH_ENV,
		)

		if (accessToken.account !== cookieAccount.account)
			throw new UserBadRequest(
				'Invalid credentials',
				'The verified account and yours does not match',
			)

		res.clearCookie('refreshToken')
		res.clearCookie('accessToken')
		res.clearCookie('account')

		return await model.delete(accessToken._id)
	},
	account: {
		update: async (req: Request, res: Response): Promise<IRefreshToken> => {
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)
			const newAccount = getToken(
				req,
				'newAccount_account',
				JWT_AUTH_ENV,
				CRYPTO_AUTH_ENV,
			)

			const response = await model.account.update(
				accessToken._id,
				newAccount.account,
			)
			const newRefreshToken = encrypt(
				response as unknown as Record<string, unknown>,
				CRYPTO_REFRESH_TOKEN_ENV,
				JWT_REFRESH_TOKEN_ENV,
				config.jwt.refreshToken,
			)
			const newAccessToken = encrypt(
				response as unknown as Record<string, unknown>,
				CRYPTO_ACCESS_TOKEN_ENV,
				JWT_ACCESS_TOKEN_ENV,
				config.jwt.accessToken,
			)

			const isSaved = await authModel.refreshToken.save(
				newRefreshToken,
				accessToken._id,
			)
			if (!isSaved)
				throw new DatabaseError(
					'Failed to save',
					'Something went wrong please try again',
				)

			res.cookie('refreshToken', newRefreshToken, config.cookies.refreshToken)
			res.cookie('accessToken', newAccessToken, config.cookies.accessToken)
			res.clearCookie('newAccount_account')

			delete (response as Partial<IRefreshToken>)._id

			return response
		},
	},
	password: {
		update: async (req: Request, res: Response): Promise<boolean> => {
			const newPwd = getToken(req, 'newPwd', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)

			await model.password.update(newPwd.account, newPwd.pwd)
			res.clearCookie('newPwd')
			return true
		},
	},
	invitation: {
		get: async (
			req: Request,
			_res: Response,
		): Promise<IUserInvitation[] | null | undefined> => {
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)
			return await model.invitation.get(accessToken._id)
		},
		create: async (req: Request, _res: Response): Promise<boolean> => {
			// req.body = account(to Invite), role, _id(group)
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)
			if (accessToken.account === req.body?.account)
				throw new Forbidden(
					'Access denied',
					'You can not invite yourself to one group',
				)
			if (
				req.body?._id === undefined ||
				req.body?.account === undefined ||
				req.body?.role === undefined
			)
				throw new UserBadRequest(
					'Missing data',
					'You need to send the _id for the group, account to invite and role',
				)

			const { _id, color, name } = await groupModel.get(req.body?._id)
			const { account, role } = req.body

			if (typeof account !== 'string')
				throw new UserBadRequest(
					'Invalid credentials',
					'Accounts must be strings',
				)
			if (!verifyEmail(account))
				throw new UserBadRequest(
					'Invalid credentials',
					`The account ${account} is invalid`,
				)

			const { fullName } = await model.get(account, { fullName: 1 })

			await groupModel.exists(_id, accessToken.account)
			return await model.invitation.create(
				{ account, fullName, role },
				{ _id, color, name },
				true,
			)
		},
		reject: async (req: Request, _res: Response): Promise<boolean> => {
			// body = _id (invitation to reject)
			if (req.body?._id === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You did not send the _id for the invitation you want to reject',
				)
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)

			return await model.invitation.reject(accessToken.account, req.body?._id)
		},
		accept: async (req: Request, _res: Response): Promise<boolean> => {
			if (req.body?._id === undefined)
				throw new UserBadRequest(
					'Invalid credentials',
					'You need to send the _id for the group you want to accept',
				)
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)

			return await model.invitation.accept(accessToken.account, req.body?._id)
		},
	},
	group: {
		get: async (
			req: Request,
			_res: Response,
		): Promise<IUserGroup[] | null | undefined> => {
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)
			return await model.group.get(accessToken._id)
		},
		remove: async (req: Request, _res: Response): Promise<boolean> => {
			// body = _id (group you want to delete)
			if (req.body?._id === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You did not send the _id for the group you want to remove',
				)

			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)

			return await model.group.remove(accessToken.account, req.body?._id, true)
		},
		add: async (req: Request, _res: Response): Promise<boolean> => {
			// body = _id(group you want to add)
			if (req.body?._id === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You did not send the _id for the group you want to add',
				)
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			)

			const { _id, color, name } = await groupModel.get(req.body?._id)

			return await model.group.add(
				accessToken.account,
				{ _id, color, name },
				true,
			)
		},
	},
}

export default service
