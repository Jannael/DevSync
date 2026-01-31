import type { Types } from 'mongoose'
import dbModel from '../../database/schemas/node/group'
import { DatabaseError, NotFound } from '../../error/error'
import type { IGroup } from '../../interface/group'
import CreateModel from '../../utils/helpers/CreateModel'

const GroupModel = {
	Get: CreateModel<{ _id: Types.ObjectId }, IGroup>({
		Model: async ({ _id }) => {
			const res = await dbModel.findOne({ _id }).lean<IGroup>()
			if (!res)
				throw new NotFound(
					'Group not found',
					'The group you are trying to access does not exist',
				)
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
			if (!res)
				throw new NotFound(
					'Group not found',
					'The group you are trying to access does not exist',
				)

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
	Update: CreateModel<
		{ _id: Types.ObjectId; data: Partial<IGroup> },
		boolean
	>({
		Model: async ({ _id, data }) => {
			const updated = await dbModel.updateOne({ _id }, data)
			if (updated.matchedCount === 0)
				throw new NotFound(
					'Group not found',
					'The group you are trying to update does not exist',
				)

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
			if (deleted.deletedCount === 0)
				throw new NotFound(
					'Group not found',
					'The group you are trying to delete does not exist',
				)

			return deleted.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group was not deleted, something went wrong please try again',
		),
	}),
}

export default GroupModel
