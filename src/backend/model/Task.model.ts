import type { Types } from 'mongoose'
import Config from '../config/Projection.config'
import dbModel from '../database/node/Task'
import { DatabaseError } from '../error/Error.instance'
import type { ITask } from '../interface/Task'
import type { ITaskListItem } from '../interface/TaskList'
import CreateModel from '../utils/helper/CreateModel.helper'

const TaskModel = {
	ListForTechLead: CreateModel<
		{ groupId: Types.ObjectId; skip: number; limit: number },
		ITaskListItem[]
	>({
		Model: async ({ groupId, skip, limit }, session) => {
			const response = await dbModel
				.find({ groupId }, Config.ITaskListItem, { session })
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
	ListForMember: CreateModel<
		{ groupId: Types.ObjectId; account: string; skip: number; limit: number },
		ITaskListItem[]
	>({
		Model: async ({ groupId, account, skip, limit }, session) => {
			const response = await dbModel
				.find(
					{ groupId, user: account, isComplete: false },
					Config.ITaskListItem,
					{ session },
				)
				.skip(skip)
				.limit(limit)
				.lean<ITaskListItem[]>()

			return response
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The tasks assigned to the user were not retrieved please try again',
		),
	}),
	CountForTechLead: CreateModel<{ groupId: Types.ObjectId }, number>({
		Model: async ({ groupId }, session) => {
			const total = await dbModel.countDocuments({ groupId }, { session })
			return total
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The total number of tasks could not be retrieved, please try again',
		),
	}),
	CountForUser: CreateModel<
		{ groupId: Types.ObjectId; account: string },
		number
	>({
		Model: async ({ groupId, account }, session) => {
			const total = await dbModel.countDocuments(
				{
					groupId,
					user: account,
					isComplete: false,
				},
				{ session },
			)
			return total
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The total number of user tasks could not be retrieved, please try again',
		),
	}),
	Get: CreateModel<
		{
			_id: Types.ObjectId
			projection: Partial<Record<keyof ITask, 0 | 1>>
		},
		ITask
	>({
		Model: async ({ _id, projection = {} }, session) => {
			const res = await dbModel
				.findOne({ _id }, projection, { session })
				.lean<ITask>()
			return res || undefined
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The task was not retrieved please try again',
		),
	}),
	Exists: CreateModel<
		{ _id: Types.ObjectId; groupId: Types.ObjectId },
		boolean
	>({
		Model: async ({ _id, groupId }, session) => {
			const res = await dbModel
				.exists({ _id, groupId })
				.session(session ?? null)
			if (!res) return false
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The task existence could not be verified, please try again',
		),
	}),
	Create: CreateModel<{ task: Omit<ITask, '_id'> }, ITask>({
		Model: async ({ task }, session) => {
			const res = await dbModel.create([task], { session })
			return res[0].toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The task was not created, please try again',
		),
	}),
	Update: CreateModel<{ _id: Types.ObjectId; data: Partial<ITask> }, boolean>({
		Model: async ({ _id, data }, session) => {
			const res = await dbModel.updateOne({ _id }, data, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The task was not updated, please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }, session) => {
			const res = await dbModel.deleteOne({ _id }, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The task was not deleted, please try again',
		),
	}),
	DeleteByGroup: CreateModel<{ groupId: Types.ObjectId }, boolean>({
		Model: async ({ groupId }, session) => {
			const res = await dbModel.deleteMany({ groupId }, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The tasks for the group were not deleted, please try again',
		),
	}),
}

export default TaskModel
