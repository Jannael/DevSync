import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import { Forbidden, UserBadRequest } from '../../error/error'
import type { IEnv } from '../../interface/Env'
import type { IGroup } from '../../interface/Group'
import model from '../../model/group/Group.model'
import userModel from '../../model/user/User.model'
import getToken from '../../utils/token'
import { verifyEmail } from '../../utils/utils'
import validator from '../../validator/validator'

dotenv.config({ quiet: true })
const { JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV } = process.env as Pick<
	IEnv,
	'JWT_ACCESS_TOKEN_ENV' | 'CRYPTO_ACCESS_TOKEN_ENV'
>

const service = {
	get: async (req: Request, _res: Response): Promise<IGroup> => {
		if (req.body?._id === undefined)
			throw new UserBadRequest(
				'Missing data',
				'You need to send the _id for the group you want',
			)
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		)
		const groups = (await userModel.group.get(accessToken._id)) ?? []
		const invitations = (await userModel.invitation.get(accessToken._id)) ?? []

		if (groups.length === 0 && invitations.length === 0)
			throw new Forbidden('Access denied', 'You do not belong to any group')

		const isGroup = groups?.some(
			(item) => item._id.toString() === req.body?._id,
		)
		const isInvitation = invitations?.some(
			(item) => item._id.toString() === req.body?._id,
		)

		if (!isGroup && !isInvitation)
			throw new Forbidden(
				'Access denied',
				'You do not belong to the group you are trying to access',
			)
		return await model.get(req.body?._id)
	},
	create: async (req: Request, _res: Response): Promise<IGroup> => {
		// body = name, color, repository?, member?: [{ account, role }], techLead: [account]
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		) // techLead
		if (req.body?.name === undefined || req.body?.color === undefined) {
			throw new UserBadRequest(
				'Missing data',
				'You need to send at least the name and color for the group you want to create',
			)
		}

		const member: Array<{ account: string; fullName: string; role: string }> =
			[]
		if (req.body?.member !== undefined && Array.isArray(req.body?.member)) {
			for (const { account, role } of req.body.member) {
				if (account === undefined || role === undefined) continue
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

				const user = await userModel.get(account, { fullName: 1 })
				member.push({ account, fullName: user.fullName, role })
			}
		}

		const techLead: Array<{ account: string; fullName: string }> = []
		if (req.body?.techLead !== undefined && Array.isArray(req.body?.techLead)) {
			for (const account of req.body.techLead) {
				if (account === undefined) continue
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

				const user = await userModel.get(account, { fullName: 1 })
				techLead.push({ account, fullName: user.fullName })
			}
		}

		const groupData = {
			name: req.body?.name,
			color: req.body?.color,
			repository: req.body?.repository ?? undefined,
			member,
			techLead,
		}

		validator.group.create(groupData)

		return await model.create(groupData, {
			fullName: accessToken.fullName,
			account: accessToken.account,
		})
	},
	update: async (req: Request, _res: Response): Promise<IGroup> => {
		// _id, data: { name?, color?, repository? }
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		) // it must be techLead
		if (req.body?._id === undefined)
			throw new UserBadRequest(
				'Missing data',
				'You need to send the _id for the group you want to update',
			)
		if (
			req.body?.data.techLead !== undefined ||
			req.body?.data.member !== undefined
		)
			throw new UserBadRequest(
				'Invalid credentials',
				'You only can update the name, color and repository',
			)

		validator.group.partial(req.body?.data)
		await model.exists(req.body?._id, accessToken.account)
		return await model.update(req.body?._id, req.body?.data)
	},
	delete: async (req: Request, _res: Response): Promise<boolean> => {
		const accessToken = getToken(
			req,
			'accessToken',
			JWT_ACCESS_TOKEN_ENV,
			CRYPTO_ACCESS_TOKEN_ENV,
		) // it must be techLead
		if (req.body?._id === undefined)
			throw new UserBadRequest(
				'Missing data',
				'You need to send the _id for the group you want to delete',
			)
		await model.exists(req.body?._id, accessToken.account)
		return await model.delete(req.body?._id)
	},
	member: {
		remove: async (req: Request, _res: Response): Promise<boolean> => {
			const accessToken = getToken(
				req,
				'accessToken',
				JWT_ACCESS_TOKEN_ENV,
				CRYPTO_ACCESS_TOKEN_ENV,
			) // it must be techLead
			if (req.body?._id === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You need to send the _id of the group to remove the user',
				)
			if (req.body?.account === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You need to send the account of the member you want to remove',
				)
			await model.exists(req.body?._id, accessToken.account)
			return await model.member.remove(req.body?._id, req.body?.account)
		},
		update: {
			role: async (req: Request, _res: Response): Promise<boolean> => {
				// body = _idGroup, role, account
				const accessToken = getToken(
					req,
					'accessToken',
					JWT_ACCESS_TOKEN_ENV,
					CRYPTO_ACCESS_TOKEN_ENV,
				)
				if (req.body?._id === undefined)
					throw new UserBadRequest(
						'Missing data',
						'You need to send the _id for the group',
					)
				if (req.body?.role === undefined)
					throw new UserBadRequest(
						'Missing data',
						'You need to send the role for the user',
					)
				validator.group.role(req.body?.role)
				if (req.body?.account === undefined)
					throw new UserBadRequest(
						'Missing data',
						'You need to send the account for the user you want to change the role',
					)

				const { _id, role, account } = req.body
				await model.exists(_id, accessToken.account)
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

				const { fullName } = await userModel.get(account, { fullName: 1 })

				await model.member.remove(_id, account)
				return await model.member.add(_id, { role, account, fullName })
			},
		},
	},
}

export default service
