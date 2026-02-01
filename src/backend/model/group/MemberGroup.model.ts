import type { Types } from 'mongoose'
import dbModel from '../../database/schemas/node/group'
import { DatabaseError } from '../../error/error'
import type { IGroup } from '../../interface/group'
import CreateModel from '../../utils/helpers/CreateModel'

const MemberGroupModel = {
	Add: CreateModel<
		{ groupId: Types.ObjectId; member: NonNullable<IGroup['member']>[number] },
		boolean
	>({
		Model: async ({ groupId, member }) => {
			const res = await dbModel.updateOne(
				{ _id: groupId },
				{ $push: { member } },
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The member was not added to the group',
		),
	}),
	Remove: CreateModel<{ groupId: Types.ObjectId; account: string }, boolean>({
		Model: async ({ groupId, account }) => {
			const res = await dbModel.updateOne(
				{ _id: groupId },
				{ $pull: { member: { account } } },
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The member was not remove from the group please try again',
		),
	}),
	Update: CreateModel<
		{
			groupId: Types.ObjectId
			data: { fullName: string; account: string }
			updateData: { fullName: string; account: string }
		},
		boolean
	>({
		Model: async ({ groupId, data, updateData }) => {
			const res = await dbModel.updateOne(
				{
					_id: groupId,
					'member.account': data.account,
					'member.fullName': data.fullName,
				},
				{
					$set: {
						'member.$.account': updateData.account,
						'member.$.fullName': updateData.fullName,
					},
				},
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not updated',
		),
	}),
	Exists: CreateModel<{ account: string; groupId: Types.ObjectId }, boolean>({
		Model: async ({ account, groupId }) => {
			const isMember = await dbModel.exists({
				_id: groupId,
				'member.account': account,
			})

			return isMember != null
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user may not be in the group',
		),
	}),
}

export default MemberGroupModel
