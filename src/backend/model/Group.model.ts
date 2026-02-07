import type { Types } from 'mongoose'
import dbModel from '../database/node/Group'
import { DatabaseError } from '../error/Error.instance'
import type { IGroup } from '../interface/Group'
import CreateModel from '../utils/helper/CreateModel.helper'

const GroupModel = {
	Get: CreateModel<{ _id: Types.ObjectId }, IGroup>({
		Model: async ({ _id }, session) => {
			const res = await dbModel
				.findOne({ _id }, null, { session })
				.lean<IGroup>()
			if (!res) return
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The group was not retrieved, something went wrong please try again',
		),
	}),
	Exists: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }, session) => {
			const res = await dbModel.exists({ _id }).session(session ?? null)
			if (!res) return false
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The group existence could not be verified, something went wrong please try again',
		),
	}),
	Create: CreateModel<{ data: Omit<IGroup, '_id'> }, IGroup>({
		Model: async ({ data }, session) => {
			const created = await dbModel.create([data], { session })
			const res = created[0].toObject()
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The group was not created, something went wrong please try again',
		),
	}),
	Update: CreateModel<{ _id: Types.ObjectId; data: Partial<IGroup> }, boolean>({
		Model: async ({ _id, data }, session) => {
			const updated = await dbModel.updateOne({ _id }, data, { session })
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The group was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }, session) => {
			const deleted = await dbModel.deleteOne({ _id }, { session })
			return deleted.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group was not deleted, something went wrong please try again',
		),
	}),
}

export default GroupModel
