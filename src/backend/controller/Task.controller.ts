import type { Request, Response } from 'express'
import { type ClientSession, Types } from 'mongoose'
import PaginationConfig from '../config/Pagination.config'
import Roles from '../constant/Role.constant'
import {
	Forbidden,
	NotFound,
	ServerError,
	UserBadRequest,
} from '../error/Error.instance'
import type { ITask } from '../interface/Task'
import type { ITaskList, ITaskListItem } from '../interface/TaskList'
import SolutionModel from '../model/Solution.model'
import TaskModel from '../model/Task.model'
import GetPaginationMetadata from '../utils/GetPaginationMetadata.utils'
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

const TaskController = {
	Get: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<ITask> => {
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
	List: async (
		req: Request,
		_res: Response,
		session: ClientSession | undefined,
	): Promise<ITaskList> => {
		// body = { groupId, role, accessToken, page }
		const { groupId, role, accessToken, page } = req.body

		if (page === undefined)
			throw new UserBadRequest('Missing data', 'Missing page number')
		if (typeof page !== 'number')
			throw new UserBadRequest('Invalid credentials', 'Invalid page')

		const skip = page * PaginationConfig.taskLimit
		const limit = PaginationConfig.taskLimit

		let tasks: ITaskListItem[] | undefined
		let count: number | undefined

		// TechLead gets all tasks, other roles get only their assigned tasks
		if (role === Roles.techLead) {
			// here i use a session because i do not want one if i do not get the other one
			tasks = await TaskModel.ListForTechLead({ groupId, skip, limit }, session)
			count = await TaskModel.CountForTechLead({ groupId }, session)
		} else {
			tasks = await TaskModel.ListForMember(
				{
					groupId,
					account: accessToken.account,
					skip,
					limit,
				},
				session,
			)
			count = await TaskModel.CountForUser(
				{
					groupId,
					account: accessToken.account,
				},
				session,
			)
		}

		if (!tasks || !count)
			throw new ServerError('Operation Failed', 'The tasks were not retrieved')

		const assign = tasks
			.filter((t) => t.user.includes(accessToken.account))
			.map((t) => t._id)

		const { metadata } = GetPaginationMetadata({
			totalItems: count,
			currentPage: page,
			pageSize: PaginationConfig.taskLimit,
			req,
		})

		return {
			task: tasks.map((t) => {
				return {
					_id: t._id,
					name: t.name,
					priority: t.priority,
					isComplete: t.isComplete,
					user: t.user,
				}
			}),
			// if the role is not techLead assign empty because all the task are assigned to the user
			assign: role === Roles.techLead ? assign : [],
			metadata,
		}
	},
	Create: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<ITask> => {
		// body = { data, groupId }
		const { data, groupId } = req.body
		if (!data) throw new UserBadRequest('Missing data', 'Missing task data')

		const task = TaskValidator({ ...data, groupId })
		const result = await TaskModel.Create({ task })

		if (!result)
			throw new ServerError('Operation Failed', 'The task was not created')

		return result
	},
	Update: async (
		req: Request,
		_res: Response,
		_session: ClientSession | undefined,
	): Promise<boolean> => {
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
	Delete: async (
		req: Request,
		_res: Response,
		session: ClientSession | undefined,
	): Promise<boolean> => {
		// body = { _id => taskId, groupId }
		const { _id, groupId } = req.body

		if (!_id) throw new UserBadRequest('Missing data', 'Missing task id')
		if (!Types.ObjectId.isValid(_id))
			throw new UserBadRequest('Invalid credentials', 'Invalid task id')

		const taskBelongsToGroup = await TaskModel.Exists({ _id, groupId }, session)
		if (!taskBelongsToGroup)
			throw new Forbidden('Access denied', 'Task does not belong to the group')

		const deleteSolution = await SolutionModel.Delete({ _id }, session)
		const result = await TaskModel.Delete({ _id }, session)

		if (!result || !deleteSolution)
			throw new ServerError('Operation Failed', 'The task was not deleted')

		return result
	},
}

export default TaskController
