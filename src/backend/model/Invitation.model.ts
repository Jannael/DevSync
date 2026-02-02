import type { Types } from 'mongoose'
import GroupLimits from '../config/GroupLimits'
import dbModel from '../database/node/Member'
import { DatabaseError } from '../error/Error.instances'
import type { IInvitation } from '../interface/Invitation'
import CreateModel from '../utils/helper/CreateModel.helper'

// Invitation and member are for the same collection but i created two models for them
// because they have different purposes
// because of this update functions and getRole function are in the Member model

const InvitationModel = {
	GetByGroup: CreateModel<{ _id: Types.ObjectId }, IInvitation[]>({
		Model: async ({ _id }) => {
			const res = await dbModel
				.find({ _id, isInvitation: true })
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
				.find({ account, isInvitation: true })
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
			const res = await dbModel.create({ data, isInvitation: true })
			return res.toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The invitation was not created, something went wrong please try again',
		),
	}),
	Accept: CreateModel<{ groupId: Types.ObjectId; account: string }, boolean>({
		Model: async ({ groupId, account }) => {
			const updated = await dbModel.updateOne(
				{ groupId, account },
				{ isInvitation: false },
			)
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user role was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		// => reject or cancel
		Model: async ({ _id }) => {
			const res = await dbModel.deleteOne({ _id, isInvitation: true })
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The invitation was not deleted, something went wrong please try again',
		),
	}),
}

export default InvitationModel
