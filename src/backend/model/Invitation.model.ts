import type { Types } from 'mongoose'
import GroupLimits from '../config/GroupLimits'
import dbModel from '../database/node/Invitation'
import { DatabaseError } from '../error/Error.instances'
import type { IInvitation } from '../interface/Invitation'
import CreateModel from '../utils/helper/CreateModel.helper'

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
	updateUserAccount: CreateModel<
		{ account: string; newAccount: string },
		boolean
	>({
		Model: async ({ account, newAccount }) => {
			const res = await dbModel.updateMany(
				{ account },
				{ $set: { account: newAccount } },
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The invitations were not updated, something went wrong please try again',
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
