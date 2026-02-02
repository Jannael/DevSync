import type { Request, Response } from 'express'
import { ServerError, UserBadRequest } from '../error/Error.instances'
import type { IGroup } from '../interface/Group'
import Model from './../model/Group.model'
import {
	GroupPartialValidator,
	GroupValidator,
} from '../validator/schemas/Group.schema'

const service = {
	get: async (req: Request, _res: Response): Promise<IGroup> => {
		const group = await Model.Get({ _id: req.body.groupId })
		if (!group) throw new UserBadRequest('Invalid credentials', 'Invalid group')

		return group
	},
	create: async (req: Request, _res: Response): Promise<IGroup> => {
		const group = GroupValidator(req.body.data)
		const result = await Model.Create({ data: group })
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not created')

		return result
	},
	update: async (req: Request, _res: Response): Promise<boolean> => {
		const group = GroupPartialValidator(req.body.data)
		if (Object.keys(group).length === 0)
			throw new UserBadRequest(
				'Invalid credentials',
				'You did not send any data',
			)

		const result = await Model.Update({ _id: req.body.groupId, data: group })
		if (!result)
			throw new ServerError('Operation Failed', 'The group was not updated')

		return result
	},
	delete: async (req: Request, _res: Response): Promise<boolean> => {
		const result = await Model.Delete({ _id: req.body.groupId })

		if (!result)
			throw new ServerError('Operation Failed', 'The group was not deleted')

		return result
	},
}

export default service
