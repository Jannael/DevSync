import type { Request, Response } from 'express'
import type { ClientSession } from 'mongoose'
import cookieConfig from '../config/Cookie.config'
import ProjectionConfig from '../config/Projection.config'
import CookiesKeys from '../constant/Cookie.constant'
import Roles from '../constant/Role.constant'
import { Forbidden, ServerError, UserBadRequest } from '../error/Error.instance'
import type { IUserGroups } from '../interface/Group'
import type { IInvitationsUser } from '../interface/Invitation'
import type { IRefreshToken } from '../interface/User'
import AuthModel from '../model/Auth.model'
import GroupModel from '../model/Group.model'
import InvitationModel from '../model/Invitation.model'
import MemberModel from '../model/Member.model'
import UserModel from '../model/User.model'
import {
	GenerateAccessToken,
	GenerateRefreshToken,
} from '../secret/GenerateToken'
import { GetAccessToken, GetAuth } from '../secret/GetToken'
import { PasswordValidator } from '../validator/schemas/Password.schema'
import {
	UserPartialValidator,
	UserValidator,
} from '../validator/schemas/User.schema'

const UserController = {
	Get: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<Omit<IRefreshToken, '_id'>> => {
		const accessToken = GetAccessToken({ req })
		return {
			fullName: accessToken.fullName,
			account: accessToken.account,
			nickName: accessToken.nickName,
		}
	},
	GetGroup: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IUserGroups[]> => {
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
		const returnObj = await Promise.all(
			groups.map(async (g) => {
				const group = await GroupModel.Get({
					_id: g.groupId,
					projection: { name: 1, color: 1 },
				})
				return {
					groupId: g.groupId,
					role: g.role,
					name: group?.name ?? '',
					color: group?.color ?? '#000000',
				}
			}),
		)

		return returnObj
	},
	GetInvitation: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IInvitationsUser[]> => {
		const accessToken = GetAccessToken({ req })
		const invitations = await InvitationModel.GetByUser({
			account: accessToken.account,
		})
		if (!invitations)
			throw new ServerError(
				'Operation Failed',
				'The invitations were not retrieved',
			)
		const returnObj: IInvitationsUser[] = await Promise.all(
			invitations.map(async (invitation) => {
				const group = await GroupModel.Get({
					_id: invitation.groupId,
					projection: { name: 1 },
				})
				return {
					groupId: invitation.groupId,
					role: invitation.role,
					name: group?.name ?? '',
				}
			}),
		)

		return returnObj
	},
	Update: async (
		req: Request,
		res: Response,
		session: ClientSession | undefined,
	): Promise<boolean> => {
		const { account: verifiedAccount } = GetAuth({
			req,
			tokenName: CookiesKeys.account,
		})

		const accessToken = GetAccessToken({ req })
		if (accessToken.account !== verifiedAccount)
			throw new Forbidden(
				'Access denied',
				'You are not authorized to update this user',
			)

		const { data } = req.body

		if (!data) throw new UserBadRequest('Missing data', 'Missing user data')

		if (data.pwd !== undefined) PasswordValidator({ password: data.pwd })
		const validatedData = UserPartialValidator({ ...data, account: undefined }) //account always undefined so it can not be updated here
		if (Object.keys(validatedData).length === 0) {
			throw new UserBadRequest('Missing data', 'Missing data to update')
		}

		const result = await UserModel.Update(
			{
				_id: accessToken._id,
				data: validatedData,
			},
			session,
		)

		const deleteSession = await AuthModel.RefreshToken.RemoveAll(
			{
				userId: accessToken._id,
			},
			session,
		)
		const user = await UserModel.Get(
			{
				account: accessToken.account,
				projection: ProjectionConfig.IRefreshToken,
			},
			session,
		)
		if (!user) throw new ServerError('Operation Failed', 'User not found')

		const refreshToken = GenerateRefreshToken({ content: user })
		const newAccessToken = GenerateAccessToken({ content: user })

		const savedNewSession = await AuthModel.RefreshToken.Save(
			{
				userId: accessToken._id,
				token: refreshToken,
			},
			session,
		)

		if (!result || !deleteSession || !savedNewSession) {
			throw new ServerError('Operation Failed', 'The user was not updated')
		}

		res.cookie(
			CookiesKeys.refreshToken,
			refreshToken,
			cookieConfig.refreshToken,
		)
		res.cookie(
			CookiesKeys.accessToken,
			newAccessToken,
			cookieConfig.accessToken,
		)
		res.clearCookie(CookiesKeys.account)
		return result
	},
	Create: async (
		req: Request,
		res: Response,
		session: ClientSession | undefined,
	): Promise<Omit<IRefreshToken, '_id'>> => {
		const { account } = GetAuth({ req, tokenName: CookiesKeys.account })

		const { data } = req.body
		if (!data) throw new UserBadRequest('Missing data', 'Missing user data')

		const validatedData = UserValidator({ ...data, account })
		const result = await UserModel.Create({ data: validatedData }, session)

		if (!result) {
			throw new ServerError('Operation Failed', 'The user was not created')
		}

		const tokenContent: IRefreshToken = {
			_id: result._id,
			account: result.account,
			nickName: result.nickName,
			fullName: result.fullName,
		}

		const refreshToken = GenerateRefreshToken({
			content: tokenContent,
		})
		const accessToken = GenerateAccessToken({
			content: tokenContent,
		})

		const savedSession = await AuthModel.RefreshToken.Save(
			{
				userId: result._id,
				token: refreshToken,
			},
			session,
		)
		if (!savedSession) {
			throw new ServerError('Operation Failed', 'User was not created')
		}

		res.cookie(
			CookiesKeys.refreshToken,
			refreshToken,
			cookieConfig.refreshToken,
		)
		res.cookie(CookiesKeys.accessToken, accessToken, cookieConfig.accessToken)
		res.clearCookie(CookiesKeys.account)

		return {
			fullName: result.fullName,
			account: result.account,
			nickName: result.nickName,
		}
	},
	Delete: async (
		req: Request,
		_res: Response,
		session: ClientSession | undefined,
	): Promise<boolean> => {
		const { account: verifiedAccount } = GetAuth({
			req,
			tokenName: CookiesKeys.account,
		})
		const accessToken = GetAccessToken({ req })
		if (accessToken.account !== verifiedAccount)
			throw new Forbidden(
				'Access denied',
				'You are not authorized to delete this user',
			)

		// Check if the user is the last techLead in any group
		const userMemberships = await MemberModel.GetForUser(
			{
				account: accessToken.account,
			},
			session,
		)

		if (!userMemberships) {
			throw new ServerError(
				'Operation Failed',
				'Could not verify user memberships',
			)
		}

		for (const membership of userMemberships) {
			if (membership.role === Roles.techLead) {
				const groupMembers = await MemberModel.GetForGroup(
					{
						groupId: membership.groupId,
					},
					session,
				)

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
		const deleteInvitations = await InvitationModel.DeleteByUser(
			{
				account: accessToken.account,
			},
			session,
		)
		const deleteMemberships = await MemberModel.DeleteByUser(
			{
				account: accessToken.account,
			},
			session,
		)

		if (!deleteInvitations || !deleteMemberships) {
			throw new ServerError(
				'Operation Failed',
				'Failed to delete user associations',
			)
		}

		const result = await UserModel.Delete({ _id: accessToken._id }, session)

		if (!result) {
			throw new ServerError('Operation Failed', 'The user was not deleted')
		}

		return result
	},
}

export default UserController
