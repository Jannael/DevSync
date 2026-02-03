import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import {
	Forbidden,
	NotFound,
	ServerError,
	UserBadRequest,
} from '../error/Error.instances'
import type { ISolution } from '../interface/Solution'
import SolutionModel from '../model/Solution.model'
import TaskModel from '../model/Task.model'
import hasTaskAccess from '../utils/HasTaskAccess.utils'
import {
	SolutionPartialValidator,
	SolutionValidator,
} from '../validator/schemas/Solution.schema'

// all the routes for this controller uses **RoleMiddleware** so
// 1.groupId is validated and exists
// 2.role is validated
// 3.accessToken at req.body.accessToken

// here is important to know the middleware only validates if the user is in group with the required role
// but this does not mean that the _id for the task/solution the user is sending belongs to the group
// this allows users to create solutions/tasks for other groups where they have the required role
// so keep this in mind, for this i have the Exists function in both task and solution models

const Controller = {
	Get: async (
		req: Request,
		_res: Response,
	): Promise<Omit<ISolution, 'groupId' | '_id'>> => {
		// body = { _id  => solutionId }
		const { _id, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing solution id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid solution id')

		const solutionBelongsToGroup = await SolutionModel.Exists({
			_id,
			groupId,
		})
		if (!solutionBelongsToGroup)
			throw new Forbidden(
				'Access denied',
				'Solution does not belong to the group',
			)

		const solution = await SolutionModel.Get({
			_id,
			projection: { user: 1, feature: 1, code: 1, description: 1 },
		})

		if (!solution) throw new NotFound('Solution not found')

		return solution
	},
	Create: async (req: Request, _res: Response): Promise<ISolution> => {
		// body = { data, accessToken, role, groupId } (accessToken, groupId and role come from RoleMiddleware)
		const { data, accessToken, role, groupId } = req.body
		if (!data) throw new UserBadRequest('Missing data', 'Missing solution data')
		const solution = SolutionValidator({
			...data,
			groupId,
			user: accessToken.account,
		})

		const taskExists = await TaskModel.Exists({ _id: solution._id, groupId })
		if (!taskExists)
			throw new NotFound('Task not found', 'The task does not exist')

		const task = await TaskModel.Get({
			_id: solution._id,
			projection: { user: 1 },
		})
		if (!task) throw new NotFound('Task not found')
		if (
			!hasTaskAccess({
				task: task.user,
				userAccount: accessToken.account,
				role,
			})
		) {
			throw new Forbidden(
				'Access denied',
				'You must be assigned to this task or be a techLead to create a solution',
			)
		}

		const result = await SolutionModel.Create({ data: solution })

		if (!result)
			throw new ServerError('Operation Failed', 'The solution was not created')

		return result
	},
	Update: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { _id, data, accessToken, role, groupId } => solutionId
		const { _id, data, accessToken, role, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing solution id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid solution id')
		if (!data) throw new UserBadRequest('Missing data', 'Missing solution data')

		const solutionBelongsToGroup = await SolutionModel.Exists({
			_id,
			groupId,
		})
		if (!solutionBelongsToGroup)
			throw new Forbidden(
				'Access denied',
				'Solution does not belong to the group',
			)

		const solutionData = SolutionPartialValidator(data)
		if (Object.keys(solutionData).length === 0)
			throw new UserBadRequest('Missing data', 'No data to update')

		const task = await TaskModel.Get({
			_id,
			projection: { user: 1 },
		})
		if (!task) throw new NotFound('Task not found')

		if (
			!hasTaskAccess({
				task: task.user,
				userAccount: accessToken.account,
				role,
			})
		) {
			throw new Forbidden(
				'Access denied',
				'You must be assigned to this task or be a techLead to update this solution',
			)
		}

		const result = await SolutionModel.Update({
			_id,
			data: solutionData,
		})

		if (!result)
			throw new ServerError('Operation Failed', 'The solution was not updated')

		return result
	},
	Delete: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { _id, accessToken, role } => solutionId
		const { _id, accessToken, role, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing solution id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid solution id')

		const solution = await SolutionModel.Exists({ _id, groupId })
		if (!solution) throw new NotFound('Solution not found')

		const task = await TaskModel.Get({
			_id,
			projection: { user: 1 },
		})
		if (!task) throw new NotFound('Task not found')
		if (
			!hasTaskAccess({
				task: task.user,
				userAccount: accessToken.account,
				role,
			})
		) {
			throw new Forbidden(
				'Access denied',
				'You must be assigned to this task or be a techLead to delete this solution',
			)
		}

		const result = await SolutionModel.Delete({ _id })

		if (!result)
			throw new ServerError('Operation Failed', 'The solution was not deleted')

		return result
	},
}

export default Controller
