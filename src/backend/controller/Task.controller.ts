import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import PaginationConfig from '../config/Pagination.config'
import Roles from '../constant/Role.constant'
import {
	Forbidden,
	NotFound,
	ServerError,
	UserBadRequest,
} from '../error/Error.instances'
import type { ITask } from '../interface/Task'
import type { ITaskListItem } from '../interface/TaskList'
import TaskModel from '../model/Task.model'
import {
	TaskPartialValidator,
	TaskValidator,
} from '../validator/schemas/Task.schema'

// all the routes for this controller uses **RoleMiddleware** so
// 1.groupId is validated and exists
// 2.role is validated
// 3.accessToken at req.body.accessToken

// here is important to know the middleware only validates if the user is in group with the required role
// but this does not mean that the _id for the task the user is sending belongs to the group
// this allows users to create/update/delete tasks for other groups where they have the required role
// so keep this in mind, for this i have the Exists function in task model

const Controller = {
	Get: async (req: Request, _res: Response): Promise<ITask | undefined> => {
		// body = { _id => taskId, groupId }
		const { _id, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing task id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid task id')

		const taskBelongsToGroup = await TaskModel.Exists({ _id, groupId })
		if (!taskBelongsToGroup)
			throw new Forbidden('Access denied', 'Task does not belong to the group')

		const task = await TaskModel.Get({ _id, projection: {} })
		if (!task) throw new NotFound('Task not found')

		return task
	},
	List: async (req: Request, _res: Response): Promise<ITaskListItem[]> => {
		// body = { groupId, role, accessToken, page }
		const { groupId, role, accessToken, page } = req.body

		if (!page) throw new UserBadRequest('Missing data', 'Missing page number')
		if (typeof page !== 'number')
			throw new UserBadRequest('Invalid credentials', 'Invalid page')

		const skip = page * PaginationConfig.taskLimit
		const limit = PaginationConfig.taskLimit

		let tasks: ITaskListItem[] | undefined

		// TechLead gets all tasks, other roles get only their assigned tasks
		if (role === Roles.techLead) {
			tasks = await TaskModel.ListForTechLead({ groupId, skip, limit })
		} else {
			tasks = await TaskModel.ListForMember({
				groupId,
				account: accessToken.account,
				skip,
				limit,
			})
		}

		if (!tasks)
			throw new ServerError('Operation Failed', 'The tasks were not retrieved')

		return tasks
	},
	Create: async (req: Request, _res: Response): Promise<ITask> => {
		// body = { data, groupId }
		const { data, groupId } = req.body
		if (!data) throw new UserBadRequest('Missing data', 'Missing task data')

		const task = TaskValidator({ ...data, groupId })
		const result = await TaskModel.Create({ task })

		if (!result)
			throw new ServerError('Operation Failed', 'The task was not created')

		return result
	},
	Update: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { _id => taskId, data, groupId }
		const { _id, data, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing task id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid task id')
		if (!data) throw new UserBadRequest('Missing data', 'Missing task data')

		const taskBelongsToGroup = await TaskModel.Exists({ _id, groupId })
		if (!taskBelongsToGroup)
			throw new Forbidden('Access denied', 'Task does not belong to the group')

		const taskData = TaskPartialValidator(data)
		if (Object.keys(taskData).length === 0)
			throw new UserBadRequest('Missing data', 'No data to update')

		const result = await TaskModel.Update({ _id, data: taskData })

		if (!result)
			throw new ServerError('Operation Failed', 'The task was not updated')

		return result
	},
	Delete: async (req: Request, _res: Response): Promise<boolean> => {
		// body = { _id => taskId, groupId }
		const { _id, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing task id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid task id')

		const taskBelongsToGroup = await TaskModel.Exists({ _id, groupId })
		if (!taskBelongsToGroup)
			throw new Forbidden('Access denied', 'Task does not belong to the group')

		const result = await TaskModel.Delete({ _id })

		if (!result)
			throw new ServerError('Operation Failed', 'The task was not deleted')

		return result
	},
}

export default Controller
