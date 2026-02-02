import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import { UserBadRequest } from '../error/Error.instances'
import type { IGroup } from '../interface/Group'
import Model from './../model/Group.model'

// import { GetAccessToken } from '../secret/GetToken'

const service = {
	get: async (req: Request, _res: Response): Promise<IGroup> => {
		const group = await Model.Get({ _id: req.body.groupId })
		if (!group) throw new UserBadRequest('Invalid credentials', 'Invalid group')

		return group
	},
	create: async (req: Request, _res: Response): Promise<IGroup> => {
		
	},
	update: async (req: Request, _res: Response): Promise<IGroup> => {},
	delete: async (req: Request, _res: Response): Promise<boolean> => {},
}

export default service
