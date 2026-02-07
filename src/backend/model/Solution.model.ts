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
		Model: async ({ _id, projection = {} }) => {
			const res = await dbModel.findOne({ _id }, projection).lean<ISolution>()
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
		Model: async ({ _id, groupId }) => {
			const res = await dbModel.exists({ _id, groupId })
			if (!res) return false
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The solution existence could not be verified, please try again',
		),
	}),
	Create: CreateModel<{ data: ISolution }, ISolution>({
		Model: async ({ data }) => {
			const res = await dbModel.create([data])
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
		Model: async ({ _id, data }) => {
			const res = await dbModel.updateOne({ _id }, data)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The solution was not updated please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const res = await dbModel.deleteOne({ _id })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The solution was not deleted please try again',
		),
	}),
	DeleteByGroup: CreateModel<{ groupId: Types.ObjectId }, boolean>({
		Model: async ({ groupId }) => {
			const res = await dbModel.deleteMany({ groupId })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The solutions for the group were not deleted, please try again',
		),
	}),
}

export default SolutionModel
