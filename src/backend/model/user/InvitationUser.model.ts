import type { Types } from 'mongoose'
import dbModel from '../../database/schemas/node/user'
import { DatabaseError } from '../../error/error'
import type { IUserInvitation } from '../../interface/user'
import CreateModel from '../../utils/helpers/CreateModel'

const InvitationUserModel = {
	Get: CreateModel<{ userId: Types.ObjectId }, IUserInvitation[] | null>({
		Model: async ({ userId }) => {
			const user = await dbModel
				.findOne({ _id: userId }, { invitation: 1, _id: 0 })
				.lean()

			if (user === null) return null
			return user.invitation || []
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The invitations were not retrieved, something went wrong please try again',
		),
	}),
	Create: CreateModel<
		{ userAccount: string; invitation: IUserInvitation },
		boolean
	>({
		Model: async ({ userAccount, invitation }) => {
			const res = await dbModel.updateOne(
				{ account: userAccount },
				{ $push: { invitation } },
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not invited, something went wrong please try again',
		),
	}),
	Remove: CreateModel<
		{ userAccount: string; invitationId: Types.ObjectId },
		boolean
	>({
		Model: async ({ userAccount, invitationId }) => {
			const res = await dbModel.updateOne(
				{ account: userAccount },
				{ $pull: { invitation: { _id: invitationId } } },
			)

			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The invitation was not removed from the user, something went wrong please try again',
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
				{ account: userAccount, 'invitation._id': groupId },
				{
					'invitation.$.name': data.name,
					'invitation.$.color': data.color,
				},
			)
			return res.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not updated',
		),
	}),
}

export default InvitationUserModel
