import type { Types } from 'mongoose'
import GroupLimits from '../config/GroupLimits'
import dbModel from '../database/node/Invitation'
import { DatabaseError } from '../error/error'
import type { IInvitation } from '../interface/Invitation'
import CreateModel from '../utils/helpers/CreateModel.helper'

const InvitationModel = {
	GetByGroup: CreateModel<{ _id: Types.ObjectId }, IInvitation[]>({
		Model: async ({ _id }) => {
			const res = await dbModel
				.find({ _id })
				.limit(GroupLimits.maxInvitation)
				.lean<IInvitation[]>()
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The invitations were not retrieved, something went wrong please try again',
		),
	}),
	GetByUser: CreateModel<{ account: string }, IInvitation[]>({
		Model: async ({ account }) => {
			const res = await dbModel
				.find({ account })
				.limit(GroupLimits.maxInvitation)
				.lean<IInvitation[]>()
			return res
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The invitations were not retrieved, something went wrong please try again',
		),
	}),
	Create: CreateModel<{ data: IInvitation }, IInvitation>({
		Model: async ({ data }) => {
			const res = await dbModel.create(data)
			return res.toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The invitation was not created, something went wrong please try again',
		),
	}),
	Update: CreateModel<
		{ _id: Types.ObjectId; data: Partial<IInvitation> },
		boolean
	>({
		Model: async ({ _id, data }) => {
			const res = await dbModel.updateOne({ _id }, data)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The invitation was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const res = await dbModel.deleteOne({ _id })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The invitation was not deleted, something went wrong please try again',
		),
	}),
}

export default InvitationModel
