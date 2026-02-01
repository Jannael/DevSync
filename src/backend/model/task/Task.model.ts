import type { Types } from 'mongoose'
import Config from '../../config/Projection.config'
import dbModel from './../../database/node/task'
import { DatabaseError } from '../../error/error'
import type { ITask } from '../../interface/Task'
import type { ITaskListItem } from '../../interface/TaskList'
import CreateModel from '../../utils/helpers/CreateModel'

const TaskModel = {
	List: CreateModel<
		{ groupId: Types.ObjectId; skip: number; limit: number },
		ITaskListItem[]
	>({
		Model: async ({ groupId, skip, limit }) => {
			const response = await dbModel
				.find({ groupId }, Config.ITaskListItem)
				.skip(skip)
				.limit(limit)
				.lean<ITaskListItem[]>()

			return response
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The task was not retrieved please try again',
		),
	}),
	Get: CreateModel<
		{
			_id: Types.ObjectId
			projection?: { [key: string]: 0 | 1 | boolean }
		},
		Partial<ITask | null>
	>({
		Model: async ({ _id, projection = {} }) => {
			const res = await dbModel.findOne({ _id }, projection).lean<ITask>()
			return res || null
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The task was not retrieved please try again',
		),
	}),
	Create: CreateModel<{ task: Omit<ITask, '_id'> }, ITask>({
		Model: async ({ task }) => {
			const res = await dbModel.create(task)
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The task was not created, please try again',
		),
	}),
	Update: CreateModel<{ _id: Types.ObjectId; data: Partial<ITask> }, boolean>({
		Model: async ({ _id, data }) => {
			const res = await dbModel.updateOne({ _id }, data)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The task was not updated, please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const res = await dbModel.deleteOne({ _id })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The task was not deleted, please try again',
		),
	}),
}

export default TaskModel
