import type { Request, Response } from 'express'
import { type ClientSession, Types } from 'mongoose'
import Roles, { DefaultRole } from '../constant/Role.constant'
import {
	Forbidden,
	NotFound,
	ServerError,
	UserBadRequest,
} from '../error/Error.instance'
import type { IGroup } from '../interface/Group'
import type { IInvitation } from '../interface/Invitation'
import type { IMember } from '../interface/Member'
import Model from './../model/Group.model'
import InvitationModel from '../model/Invitation.model'
import MemberModel from '../model/Member.model'
import SolutionModel from '../model/Solution.model'
import TaskModel from '../model/Task.model'
import { GetAccessToken } from '../secret/GetToken'
import {
	GroupPartialValidator,
	GroupValidator,
} from '../validator/schemas/Group.schema'

const GroupController = {
	Get: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IGroup> => {
		// body = { groupId }
		const group = await Model.Get({ _id: req.body.groupId })
		if (!group) throw new NotFound('Group not found')

		return group
	},
	GetInvitation: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IInvitation[]> => {
		// body = { groupId }
		// Get all invitations emitted by a group
		const invitations = await InvitationModel.GetByGroup({
			_id: req.body.groupId,
		})
		if (!invitations)
			throw new ServerError(
				'Operation Failed',
				'The invitations were not retrieved',
			)

		return invitations
	},
	Create: async (
		req: Request,
		_res: Response,
		session: ClientSession | undefined,
	): Promise<IGroup> => {
		// body = { data }
		const group = GroupValidator(req.body.data)
		const accessToken = GetAccessToken({ req })
		const result = await Model.Create({ data: group }, session)
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not created')

		const addTechLead = await MemberModel.Create(
			{
				data: {
					groupId: result._id,
					account: accessToken.account,
					role: Roles.techLead,
				},
			},
			session,
		)
		if (!addTechLead)
			throw new ServerError('Operation Failed', 'The techLead was not added')

		return result
	},
	Update: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId, data }
		const { groupId, data } = req.body
		const group = GroupPartialValidator(data)
		if (Object.keys(group).length === 0)
			throw new UserBadRequest('Missing data', 'Missing data to update')

		const result = await Model.Update({ _id: groupId, data: group })
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not updated')

		return result
	},
	Delete: async (
		req: Request,
		_res: Response,
		session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId }
		const { groupId } = req.body
		const resultDeleteMembers = await MemberModel.DeleteByGroup(
			{ groupId },
			session,
		)
		const resultDeleteInvitations = await InvitationModel.DeleteByGroup(
			{
				groupId,
			},
			session,
		)
		const resultDeleteSolutions = await SolutionModel.DeleteByGroup(
			{ groupId },
			session,
		)
		const resultDeleteTasks = await TaskModel.DeleteByGroup(
			{ groupId },
			session,
		)
		const result = await Model.Delete({ _id: groupId }, session)

		if (
			!result ||
			!resultDeleteMembers ||
			!resultDeleteInvitations ||
			!resultDeleteSolutions ||
			!resultDeleteTasks
		)
			throw new ServerError('Operation Failed', 'The group was not deleted')

		return result && resultDeleteInvitations && resultDeleteMembers
	},
	Join: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<IMember> => {
		// body = { groupId }
		const { groupId } = req.body
		if (!groupId) throw new UserBadRequest('Missing data', 'Missing groupId')
		if (!Types.ObjectId.isValid(groupId))
			throw new UserBadRequest('Invalid credentials', 'Invalid groupId')

		const accessToken = GetAccessToken({ req })

		const group = await Model.Get({ _id: groupId })
		if (!group) throw new NotFound('Group not found')

		const existingMember = await MemberModel.GetRole({
			groupId,
			account: accessToken.account,
		})
		if (existingMember)
			throw new Forbidden(
				'Access denied',
				'You are already a member of this group',
			)

		const result = await MemberModel.Create({
			data: {
				groupId,
				account: accessToken.account,
				role: DefaultRole,
			},
		})

		if (!result)
			throw new ServerError('Operation Failed', 'Could not join the group')

		return result
	},
	Quit: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { groupId, accessToken, role } (accessToken and role come from RoleMiddleware)
		const { groupId, accessToken, role: userRole } = req.body

		if (userRole === Roles.techLead) {
			const allMembers = await MemberModel.GetForGroup({ groupId })
			if (!allMembers)
				throw new ServerError(
					'Operation Failed',
					'Could not verify group members',
				)

			const techLeadCount = allMembers.filter(
				(member) => member.role === Roles.techLead,
			).length

			if (techLeadCount <= 1) {
				throw new Forbidden(
					'Access denied',
					'Cannot quit as the last techLead. Transfer leadership or delete the group.',
				)
			}
		}

		const result = await MemberModel.RemoveUser({
			groupId,
			account: accessToken.account,
		})

		if (!result)
			throw new ServerError('Operation Failed', 'Could not quit the group')

		return result
	},
}

export default GroupController
