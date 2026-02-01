import type { Types } from 'mongoose'
import dbModel from '../../database/schemas/node/group'
import { DatabaseError } from '../../error/error'
import type { IGroup } from '../../interface/group'
import CreateModel from '../../utils/helpers/CreateModel'

const techLeadGroupModel = {
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
					'techLead.account': data.account,
					'techLead.fullName': data.fullName,
				},
				{
					$set: {
						'techLead.$.account': updateData.account,
						'techLead.$.fullName': updateData.fullName,
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
			const isTechLead = await dbModel.exists({
				_id: groupId,
				'techLead.account': account,
			})

			return isTechLead != null
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user may not be in the group',
		),
	}),
	Remove: CreateModel<{ groupId: Types.ObjectId; account: string }, boolean>({
		Model: async ({ groupId, account }) => {
			const res = await dbModel.updateOne(
				{ _id: groupId },
				{ $pull: { techLead: { account } } },
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The member was not remove from the group please try again',
		),
	}),
	Add: CreateModel<
		{
			groupId: Types.ObjectId
			techLead: NonNullable<IGroup['techLead']>[number]
		},
		boolean
	>({
		Model: async ({ groupId, techLead }) => {
			const res = await dbModel.updateOne(
				{ _id: groupId },
				{ $push: { techLead } },
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The member was not added to the group',
		),
	}),
}
export default techLeadGroupModel
