import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import model from '../../model/solution/Solution.model'
import taskModel from './../../model/task/model'
import { Forbidden, UserBadRequest } from '../error/Error.constructor'
import type { ISolution } from '../interface/Solution'
import validator from '../validator/Merge.validator'

/*
Auth middleware guarantees this:
  1. groupId
  2. accessToken at req.body?.accessToken
  3. User belongs to the group
  4. The user have the required role to the operation
  5. role at req.body.role
 */

const service = {
	get: async (req: Request, _res: Response): Promise<ISolution> => {
		// body = taskId
		if (req.body?.taskId === undefined)
			throw new UserBadRequest('Missing data', 'You need to send the taskId')
		if (!Types.ObjectId.isValid(req.body?.taskId))
			throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

		const solution = (await model.get(req.body?.taskId)) as ISolution
		if (solution.groupId?.toString() !== req.body?.groupId)
			throw new Forbidden('Access denied', 'You can not get the solution')

		return solution
	},
	create: async (req: Request, _res: Response): Promise<Types.ObjectId> => {
		// body = groupId, taskId, data: { feature, code, description }
		if (req.body?.taskId === undefined)
			throw new UserBadRequest('Missing data', 'You need to send the taskId')
		if (!Types.ObjectId.isValid(req.body?.taskId))
			throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

		// first we need to verify the task is assign to the user
		const taskUsers = await taskModel.get(req.body?.taskId, {
			user: 1,
			groupId: 1,
		})
		if (taskUsers.user === undefined)
			throw new Forbidden(
				'Access denied',
				'You can not create a solution to the task because no one is assign to it',
			)
		const isAssign = taskUsers.user.find(
			(account) => req.body?.accessToken?.account === account,
		)
		if (isAssign === undefined)
			throw new Forbidden(
				'Access denied',
				'You can not create a solution to this task',
			)

		if (taskUsers.groupId?.toString() !== req.body?.groupId)
			throw new Forbidden('Access denied', 'You can not create a solution')

		const solution = validator.solution.create({
			...req.body.data, // CODE, FEATURE, DESCRIPTION
			_id: req.body.taskId,
			groupId: req.body?.groupId,
		})

		await taskModel.update(req.body?.taskId, { isComplete: true })

		return await model.create({
			...solution,
			user: req.body?.accessToken?.account,
		} as unknown as ISolution)
	},
	update: async (req: Request, _res: Response): Promise<boolean> => {
		// body = groupId, taskId, data: {code, feature, description}
		if (req.body?.taskId === undefined)
			throw new UserBadRequest('Missing data', 'You need to send the taskId')
		if (!Types.ObjectId.isValid(req.body?.taskId))
			throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

		const data = validator.solution.partial(req.body.data)
		if (data === undefined)
			throw new UserBadRequest(
				'Missing data',
				'You did not send any data to update',
			)

		const isOwner = await model.get(req.body?.taskId, { user: 1, groupId: 1 })
		if (isOwner.groupId?.toString() !== req.body.groupId)
			throw new Forbidden('Access denied', 'You can not update the solution')

		if (req.body?.role !== 'techLead') {
			if (isOwner.user !== req.body?.accessToken?.account)
				throw new Forbidden(
					'Access denied',
					'You can not update a solution you did not created',
				)
		}

		return await model.update(req.body?.taskId, data)
	},
	delete: async (req: Request, _res: Response): Promise<boolean> => {
		// body = taskId, groupId
		if (req.body?.taskId === undefined)
			throw new UserBadRequest('Missing data', 'You need to send the taskId')
		if (!Types.ObjectId.isValid(req.body?.taskId))
			throw new UserBadRequest('Invalid credentials', 'taskId is invalid')

		const isOwner = await model.get(req.body?.taskId, { user: 1, groupId: 1 })
		if (isOwner.groupId?.toString() !== req.body.groupId)
			throw new Forbidden('Access denied', 'You can not update the solution')

		if (req.body.role !== 'techLead') {
			if (isOwner.user !== req.body?.accessToken?.account)
				throw new Forbidden(
					'Access denied',
					'You can not delete a solution you did not created',
				)
		}

		return await model.delete(req.body?.taskId)
	},
}

export default service
