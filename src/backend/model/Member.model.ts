import type { Types } from 'mongoose'
import dbModel from '../database/node/Member'
import { DatabaseError } from '../error/Error.instances'
import type { IMember } from '../interface/Member'
import CreateModel from '../utils/helper/CreateModel.helper'

const MemberModel = {
	GetForUser: CreateModel<{ account: string }, IMember[]>({
		Model: async ({ account }) => {
			const groups = await dbModel.find({ account, isInvitation: false }).lean<IMember[]>()
			return groups
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user groups were not retrieved, something went wrong please try again',
		),
	}),
	GetForGroup: CreateModel<{ groupId: Types.ObjectId }, IMember[]>({
		Model: async ({ groupId }) => {
			const users = await dbModel.find({ groupId, isInvitation: false }).lean<IMember[]>()
			return users
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The group users were not retrieved, something went wrong please try again',
		),
	}),
	GetRole: CreateModel<
		{ groupId: Types.ObjectId; account: string },
		string | null
	>({
		Model: async ({ groupId, account }) => {
			const member = await dbModel
				.findOne({ groupId, account, isInvitation: false }, { role: 1 })
				.lean()
			return member ? member.role : null
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user role was not retrieved, something went wrong please try again',
		),
	}),
	Create: CreateModel<{ data: IMember }, IMember>({
		Model: async ({ data }) => {
			const created = await dbModel.create({ ...data, isInvitation: false })
			return created.toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user group was not created, something went wrong please try again',
		),
	}),
	RemoveUser: CreateModel<
		{ groupId: Types.ObjectId; account: string },
		boolean
	>({
		Model: async ({ groupId, account }) => {
			const deleted = await dbModel.deleteOne({ groupId, account, isInvitation: false })
			return deleted.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The user group was not deleted, something went wrong please try again',
		),
	}),
	UpdateRole: CreateModel<
		{ groupId: Types.ObjectId; account: string; role: string },
		boolean
	>({
		Model: async ({ groupId, account, role }) => {
			const updated = await dbModel.updateOne({ groupId, account }, { role })
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
		Model: async ({ oldAccount, newAccount }) => {
			const updated = await dbModel.updateMany(
				{ account: oldAccount },
				{ account: newAccount },
			)
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user account was not updated, something went wrong please try again',
		),
	}),
	DeleteByGroup: CreateModel<{ groupId: Types.ObjectId }, boolean>({ // => if the group is deleted
		Model: async ({ groupId }) => {
			const deleted = await dbModel.deleteMany({ groupId })
			return deleted.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group users were not deleted, something went wrong please try again',
		),
	}),
}

export default MemberModel
