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
	GetRole: CreateModel<{ groupId: Types.ObjectId; account: string }, string>({
		Model: async ({ groupId, account }) => {
			const member = await dbModel
				.findOne({ groupId, account, isInvitation: true }, { role: 1 })
				.lean()
			return member ? member.role : undefined
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user role was not retrieved, something went wrong please try again',
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
	UpdateRole: CreateModel<
		{ groupId: Types.ObjectId; account: string; role: string },
		boolean
	>({
		Model: async ({ groupId, account, role }) => {
			const updated = await dbModel.updateOne(
				{ groupId, account, isInvitation: true },
				{ role },
			)
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user role was not updated, something went wrong please try again',
		),
	}),
	UpdateAccount: CreateModel<
		{ oldAccount: string; newAccount: string },
		boolean
	>({
		Model: async () => {
			//since calling this function does not make sense if you do not call MemberModel.UpdateAccount as well
			// and both of this models refer to the same collection
			// i will just mock this function
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user account was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ groupId: Types.ObjectId; account: string }, boolean>({
		// => reject or cancel
		Model: async ({ groupId, account }) => {
			const res = await dbModel.deleteOne({
				account,
				groupId,
				isInvitation: true,
			})
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The invitation was not deleted, something went wrong please try again',
		),
	}),
	DeleteByGroup: CreateModel<{ groupId: Types.ObjectId }, boolean>({
		// => if the group is deleted
		Model: async () => {
			// same case that UpdateAccount
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group users were not deleted, something went wrong please try again',
		),
	}),
	DeleteByUser: CreateModel<{ account: string }, boolean>({
		// => remove all invitations sent to a user
		Model: async () => {
			// same case that UpdateAccount and DeleteByGroup
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The user invitations were not deleted, something went wrong please try again',
		),
	}),
}

export default InvitationModel
