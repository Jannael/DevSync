import type { Request, Response } from 'express'
import Roles from '../constant/Role.constant'
import { NotFound, ServerError, UserBadRequest } from '../error/Error.instances'
import type { IGroup } from '../interface/Group'
import Model from './../model/Group.model'
import InvitationModel from '../model/Invitation.model'
import MemberModel from '../model/Member.model'
import { GetAccessToken } from '../secret/GetToken'
import {
	GroupPartialValidator,
	GroupValidator,
} from '../validator/schemas/Group.schema'

// todo join and quit group

const Controller = {
	Get: async (req: Request, _res: Response): Promise<IGroup> => {
		// body = { groupId }
		const group = await Model.Get({ _id: req.body.groupId })
		if (!group) throw new NotFound('Group not found')

		return group
	},
	Create: async (req: Request, _res: Response): Promise<IGroup> => {
		// body = { data }
		const group = GroupValidator(req.body.data)
		const accessToken = GetAccessToken({ req })
		const result = await Model.Create({ data: group })
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not created')

		const addTechLead = await MemberModel.Create({
			data: {
				groupId: result._id,
				account: accessToken.account,
				role: Roles.techLead,
			},
		})
		if (!addTechLead)
			throw new ServerError('Operation Failed', 'The techLead was not added')

		return result
	},
	Update: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { groupId, data }
		const group = GroupPartialValidator(req.body.data)
		if (Object.keys(group).length === 0)
			throw new UserBadRequest('Missing data', 'Missing data to update')

		const result = await Model.Update({ _id: req.body.groupId, data: group })
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not updated')

		return result
	},
	Delete: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { groupId }
		const resultDeleteMembers = await MemberModel.DeleteByGroup({
			groupId: req.body.groupId,
		})
		const resultDeleteInvitations = await InvitationModel.DeleteByGroup({
			groupId: req.body.groupId,
		})
		const result = await Model.Delete({ _id: req.body.groupId })

		if (!result || !resultDeleteMembers || !resultDeleteInvitations)
			throw new ServerError('Operation Failed', 'The group was not deleted')

		return result && resultDeleteInvitations && resultDeleteMembers
	},
}

export default Controller
