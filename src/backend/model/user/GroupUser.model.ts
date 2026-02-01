import type { Types } from 'mongoose'
import dbModel from '../../database/schemas/node/user'
import { DatabaseError } from '../../error/error'
import type { IUserGroup } from '../../interface/user'
import CreateModel from '../../utils/helpers/CreateModel'

const GroupUserModel = {
	Get: CreateModel<{ userId: Types.ObjectId }, IUserGroup[] | null>({
		Model: async ({ userId }) => {
			const user = await dbModel
				.findOne({ _id: userId }, { group: 1, _id: 0 })
				.lean()
			if (user === null) return null

			return user.group || []
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The groups were not retrieved, something went wrong please try again',
		),
	}),
	Create: CreateModel<{ userAccount: string; group: IUserGroup }, boolean>({
		Model: async ({ userAccount, group }) => {
			const res = await dbModel.updateOne(
				{ account: userAccount },
				{ $push: { group } },
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The group was not added to the user, something went wrong please try again',
		),
	}),
	Remove: CreateModel<
		{ userAccount: string; groupId: Types.ObjectId },
		boolean
	>({
		Model: async ({ userAccount, groupId }) => {
			const res = await dbModel.updateOne(
				{ account: userAccount },
				{ $pull: { group: { _id: groupId } } },
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The group was not removed from the user, something went wrong please try again',
		),
	}),
	Update: CreateModel<
		{
			userAccount: string
			groupId: Types.ObjectId
			data: { name: string; color: string }
		},
		boolean
	>({
		Model: async ({ userAccount, groupId, data }) => {
			const res = await dbModel.updateOne(
				{ account: userAccount, 'group._id': groupId },
				{ 'group.$.name': data.name, 'group.$.color': data.color },
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not updated',
		),
	}),
}

export default GroupUserModel
