import type { Request, Response } from 'express'
import Roles from '../constant/Role.constant'
import { Forbidden, ServerError, UserBadRequest } from '../error/Error.instances'
import type { IMember } from '../interface/Member'
import MemberModel from '../model/Member.model'
import AccountValidator from '../validator/Account.validator'

const Controller = {
	Get: async (req: Request, _res: Response): Promise<IMember[]> => {
		// body = { groupId }
		// Get all members of a group
		const { groupId } = req.body
		const members = await MemberModel.GetForGroup({ groupId })

		if (!members)
			throw new ServerError(
				'Operation Failed',
				'The members were not retrieved',
			)

		return members
	},
	UpdateRole: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { groupId, account, role }
		const { groupId, account, role } = req.body

		if (!account || !role) {
			throw new UserBadRequest(
				'Missing data',
				'Missing account or role',
			)
		}

		if (!AccountValidator(account))
			throw new UserBadRequest('Invalid credentials', 'Invalid account')

		// Validate that the role is valid
		const validRoles = [Roles.developer, Roles.documenter, Roles.techLead]
		if (!validRoles.includes(role))
			throw new UserBadRequest('Invalid credentials', 'Invalid role')

		const result = await MemberModel.UpdateRole({
			groupId,
			account,
			role,
		})

		if (!result)
			throw new ServerError('Operation Failed', 'The role was not updated')

		return result
	},
	Remove: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { groupId, account }
		const { groupId, account } = req.body

		if(!account) {
			throw new UserBadRequest('Missing data', 'Missing groupId or account')
		}

		if (!AccountValidator(account))
			throw new UserBadRequest('Invalid credentials', 'Invalid account')

		// Check if the user to be removed is a techLead
		const userRole = await MemberModel.GetRole({ groupId, account })

		if (userRole === Roles.techLead) {
			// Get all members to count how many techLeads exist
			const allMembers = await MemberModel.GetForGroup({ groupId })

			if (!allMembers)
				throw new ServerError(
					'Operation Failed',
					'Could not verify group members',
				)

			// Count techLeads
			const techLeadCount = allMembers.filter(
				(member) => member.role === Roles.techLead,
			).length

			// Prevent removal if this is the last techLead
			if (techLeadCount <= 1) {
				throw new Forbidden(
					'Access denied',
					'Cannot remove the last techLead from the group',
				)
			}
		}

		const result = await MemberModel.RemoveUser({
			groupId,
			account,
		})

		if (!result)
			throw new ServerError('Operation Failed', 'The member was not removed')

		return result
	},
}

export default Controller
