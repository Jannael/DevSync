import type { Request, Response } from 'express'
import { type ClientSession, Types } from 'mongoose'
import { ValidRoles } from '../constant/Role.constant'
import {
	DuplicateData,
	ServerError,
	UserBadRequest,
} from '../error/Error.instance'
import type { IInvitation } from '../interface/Invitation'
import InvitationModel from '../model/Invitation.model'
import { GetAccessToken } from '../secret/GetToken'
import AccountValidator from '../validator/Account.validator'
import { InvitationValidator } from '../validator/schemas/Invitation.schema'

const InvitationController = {
	Create: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IInvitation> => {
		// body = { account, role }
		const exists = await InvitationModel.Exists({
			groupId: req.body.groupId,
			account: req.body.data.account,
		})
		if (exists) throw new DuplicateData('Invitation already exists')

		const invitation = InvitationValidator({
			...req.body.data,
			groupId: req.body.groupId,
		})
		const result = await InvitationModel.Create({ data: invitation })
		if (!result)
			throw new ServerError(
				'Operation Failed',
				'The invitation was not created',
			)

		return {
			groupId: invitation.groupId,
			account: invitation.account,
			role: invitation.role,
		}
	},
	UpdateRole: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId, account, role }
		const { groupId, account, newRole } = req.body

		if (!newRole || !account) {
			throw new UserBadRequest('Missing data', 'Missing account or role')
		}
		if (!AccountValidator({ account }))
			throw new UserBadRequest('Invalid credentials', 'Invalid account')
		if (!ValidRoles.includes(newRole))
			throw new UserBadRequest('Invalid credentials', 'Invalid role')

		const result = await InvitationModel.UpdateRole({
			groupId,
			account,
			role: newRole,
		})

		if (!result)
			throw new ServerError('Operation Failed', 'The role was not updated')

		return result
	},
	Accept: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId }
		const accessToken = GetAccessToken({ req })

		const { groupId } = req.body
		if (!groupId) throw new UserBadRequest('Missing data', 'Missing group id')
		if (!Types.ObjectId.isValid(groupId))
			throw new UserBadRequest('Invalid credentials', 'Invalid group id')

		const result = await InvitationModel.Accept({
			groupId,
			account: accessToken.account,
		})

		if (!result)
			throw new ServerError(
				'Operation Failed',
				'The invitation was not accepted',
			)

		return result
	},
	Reject: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId } => invitationId
		const accessToken = GetAccessToken({ req })
		const { groupId } = req.body
		if (!groupId)
			throw new UserBadRequest('Missing data', 'Missing invitation id')
		if (!Types.ObjectId.isValid(groupId))
			throw new UserBadRequest('Invalid credentials', 'Invalid invitation id')

		const result = await InvitationModel.Delete({
			groupId,
			account: accessToken.account,
		})

		if (!result)
			throw new ServerError(
				'Operation Failed',
				'The invitation was not rejected',
			)

		return result
	},
	Cancel: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId, account }
		const { groupId, account } = req.body

		if (!account) throw new UserBadRequest('Missing data', 'Missing account')
		if (!AccountValidator({ account }))
			throw new UserBadRequest('Invalid credentials', 'Invalid account')

		const result = await InvitationModel.Delete({
			groupId,
			account,
		})

		if (!result)
			throw new ServerError(
				'Operation Failed',
				'The invitation was not cancelled',
			)

		return result
	},
}

export default InvitationController
