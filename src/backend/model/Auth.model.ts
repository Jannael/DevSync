import bcrypt from 'bcrypt'
import type { Types } from 'mongoose'
import Config from '../config/Projection.config'
import dbModel from '../database/node/User'
import { DatabaseError } from '../error/Error.instance'
import type { IRefreshToken } from '../interface/User'
import CreateModel from '../utils/helper/CreateModel.helper'

const AuthModel = {
	Login: CreateModel<{ account: string; pwd: string }, IRefreshToken>({
		Model: async ({ account, pwd }: { account: string; pwd: string }) => {
			const user = await dbModel
				.findOne({ account }, { ...Config.IRefreshToken, pwd: 1 })
				.lean<IRefreshToken & { pwd?: string }>()

			const isMatch =
				user != null &&
				user.pwd !== undefined &&
				(await bcrypt.compare(pwd, user.pwd))

			if (!user || !isMatch) return

			delete user?.pwd
			return user
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user was not retrieved, something went wrong please try again',
		),
	}),
	Exists: CreateModel<{ account: string }, boolean>({
		Model: async ({ account }: { account: string }) => {
			const exists = await dbModel.exists({ account })
			if (!exists) return false
			return true
		},
		DefaultError: new DatabaseError(
			'Failed to access data',
			'The user was not retrieved, something went wrong please try again',
		),
	}),
	RefreshToken: {
		Save: CreateModel<{ token: string; userId: Types.ObjectId }, boolean>({
			Model: async ({ token, userId }) => {
				const result = await dbModel.updateOne(
					{ _id: userId },
					{ $push: { refreshToken: token } },
				)

				return result.matchedCount === 1 && result.modifiedCount === 1
			},
			DefaultError: new DatabaseError(
				'Failed to save',
				'The session was not saved, something went wrong please try again',
			),
		}),
		Remove: CreateModel<{ token: string; userId: Types.ObjectId }, boolean>({
			Model: async ({ token, userId }) => {
				const result = await dbModel.updateOne(
					{ _id: userId },
					{ $pull: { refreshToken: token } },
				)

				return result.matchedCount === 1 && result.modifiedCount === 1
			},
			DefaultError: new DatabaseError(
				'Failed to remove',
				'The session was not removed, something went wrong please try again',
			),
		}),
		Verify: CreateModel<{ token: string; userId: Types.ObjectId }, boolean>({
			Model: async ({ token, userId }) => {
				const result = await dbModel
					.findOne({ _id: userId }, { refreshToken: 1, _id: 0 })
					.lean()

				const tokens = result?.refreshToken
				return Array.isArray(tokens) && tokens.includes(token)
			},
			DefaultError: new DatabaseError(
				'Failed to access data',
				'The user was not retrieved, something went wrong please try again',
			),
		}),
	},
}

export default AuthModel
