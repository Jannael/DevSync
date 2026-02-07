import type { Types } from 'mongoose'
import dbModel from '../database/node/Solution'
import { DatabaseError } from '../error/Error.instance'
import type { ISolution } from '../interface/Solution'
import CreateModel from '../utils/helper/CreateModel.helper'

const SolutionModel = {
	Get: CreateModel<
		{
			_id: Types.ObjectId
			projection: Partial<Record<keyof ISolution, 0 | 1>>
		},
		ISolution
	>({
		Model: async ({ _id, projection = {} }, session) => {
			const res = await dbModel
				.findOne({ _id }, projection, { session })
				.lean<ISolution>()
			if (!res) return
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The solution was not retrieved please try again',
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
			'The solution existence could not be verified, please try again',
		),
	}),
	Create: CreateModel<{ data: ISolution }, ISolution>({
		Model: async ({ data }, session) => {
			const res = await dbModel.create([data], { session })
			return res[0].toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The solution was not created please try again',
		),
	}),
	Update: CreateModel<
		{ _id: Types.ObjectId; data: Partial<Omit<ISolution, '_id'>> },
		boolean
	>({
		Model: async ({ _id, data }, session) => {
			const res = await dbModel.updateOne({ _id }, data, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The solution was not updated please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }, session) => {
			const res = await dbModel.deleteOne({ _id }, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The solution was not deleted please try again',
		),
	}),
	DeleteByGroup: CreateModel<{ groupId: Types.ObjectId }, boolean>({
		Model: async ({ groupId }, session) => {
			const res = await dbModel.deleteMany({ groupId }, { session })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The solutions for the group were not deleted, please try again',
		),
	}),
}

export default SolutionModel
