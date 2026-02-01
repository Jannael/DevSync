import type { Types } from 'mongoose'
import dbModel from '../database/node/Group'
import { DatabaseError } from '../error/error'
import type { IGroup } from '../interface/Group'
import CreateModel from '../utils/helpers/CreateModel.helper'

const GroupModel = {
	Get: CreateModel<{ _id: Types.ObjectId }, IGroup | null>({
		Model: async ({ _id }) => {
			const res = await dbModel.findOne({ _id }).lean<IGroup>()
			if (!res) return null
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The group was not retrieved, something went wrong please try again',
		),
	}),
	Exists: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const res = await dbModel.exists({ _id })
			if (!res) return false
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The group existence could not be verified, something went wrong please try again',
		),
	}),
	Create: CreateModel<
		{ data: Omit<IGroup, '_id'> },
		IGroup & Required<Pick<IGroup, '_id'>>
	>({
		Model: async ({ data }) => {
			const created = await dbModel.create(data)
			const res = created.toObject()
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The group was not created, something went wrong please try again',
		),
	}),
	Update: CreateModel<{ _id: Types.ObjectId; data: Partial<IGroup> }, boolean>({
		Model: async ({ _id, data }) => {
			const updated = await dbModel.updateOne({ _id }, data)
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The group was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const deleted = await dbModel.deleteOne({ _id })
			return deleted.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group was not deleted, something went wrong please try again',
		),
	}),
}

export default GroupModel
