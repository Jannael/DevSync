import type { Request, Response } from 'express'
import CookiesKeys from '../constant/Cookie.constant'
import Roles from '../constant/Role.constant'
import {
	Forbidden,
	ServerError,
	UserBadRequest,
} from '../error/Error.instances'
import type { IMember } from '../interface/Member'
import type { IRefreshToken } from '../interface/User'
import InvitationModel from '../model/Invitation.model'
import MemberModel from '../model/Member.model'
import UserModel from '../model/User.model'
import { GetAccessToken, GetAuth } from '../secret/GetToken'
import { PasswordValidator } from '../validator/schemas/Password.schema'
import {
	UserPartialValidator,
	UserValidator,
} from '../validator/schemas/User.schema'

const Controller = {
	Get: async (req: Request, _res: Response): Promise<IRefreshToken> => {
		const accessToken = GetAccessToken({ req })
		return accessToken
	},
	GetGroup: async (req: Request, _res: Response): Promise<IMember[]> => {
		const accessToken = GetAccessToken({ req })
		const groups = await MemberModel.GetForUser({
			account: accessToken.account,
		})

		if (!groups) {
			throw new ServerError(
				'Operation Failed',
				'The user groups were not retrieved',
			)
		}

		return groups
	},
	Update: async (req: Request, _res: Response): Promise<boolean> => {
		GetAuth({ req, tokenName: CookiesKeys.account })

		const accessToken = GetAccessToken({ req })
		const { data } = req.body

		if (!data) throw new UserBadRequest('Missing data', 'Missing user data')

		if (data.pwd !== undefined) PasswordValidator({ password: data.pwd })
		const validatedData = UserPartialValidator({ ...data, account: undefined }) //account always undefined so it can not be updated here
		if (Object.keys(validatedData).length === 0) {
			throw new UserBadRequest('Missing data', 'Missing data to update')
		}

		const result = await UserModel.Update({
			_id: accessToken._id,
			data: validatedData,
		})

		if (!result) {
			throw new ServerError('Operation Failed', 'The user was not updated')
		}

		return result
	},
	Create: async (req: Request, _res: Response): Promise<IRefreshToken> => {
		GetAuth({ req, tokenName: CookiesKeys.account })

		const { data } = req.body
		if (!data) throw new UserBadRequest('Missing data', 'Missing user data')

		const validatedData = UserValidator(data)
		const result = await UserModel.Create({ data: validatedData })

		if (!result) {
			throw new ServerError('Operation Failed', 'The user was not created')
		}

		return result
	},
	Delete: async (req: Request, _res: Response): Promise<boolean> => {
		GetAuth({ req, tokenName: CookiesKeys.account })
		const accessToken = GetAccessToken({ req })

		// Check if the user is the last techLead in any group
		const userMemberships = await MemberModel.GetForUser({
			account: accessToken.account,
		})

		if (!userMemberships) {
			throw new ServerError(
				'Operation Failed',
				'Could not verify user memberships',
			)
		}

		for (const membership of userMemberships) {
			if (membership.role === Roles.techLead) {
				const groupMembers = await MemberModel.GetForGroup({
					groupId: membership.groupId,
				})

				if (!groupMembers) {
					throw new ServerError(
						'Operation Failed',
						'Could not verify group members',
					)
				}

				const techLeadCount = groupMembers.filter(
					(m) => m.role === Roles.techLead,
				).length

				if (techLeadCount <= 1) {
					throw new Forbidden(
						'Access denied',
						`Cannot delete account as the last techLead of group ${membership.groupId}. Transfer leadership or delete the group first.`,
					)
				}
			}
		}

		// Cascading deletes
		const deleteInvitations = await InvitationModel.DeleteByUser({
			account: accessToken.account,
		})
		const deleteMemberships = await MemberModel.DeleteByUser({
			account: accessToken.account,
		})

		if (!deleteInvitations || !deleteMemberships) {
			throw new ServerError(
				'Operation Failed',
				'Failed to delete user associations',
			)
		}

		const result = await UserModel.Delete({ _id: accessToken._id })

		if (!result) {
			throw new ServerError('Operation Failed', 'The user was not deleted')
		}

		return result
	},
}

export default Controller
