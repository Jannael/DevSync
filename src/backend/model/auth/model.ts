import bcrypt from 'bcrypt'
import type { Types } from 'mongoose'
import config from '../../config/config'
import dbModel from './../../database/schemas/node/user'
import {
	type CustomError,
	DatabaseError,
	NotFound,
	UserBadRequest,
} from '../../error/error'
import errorHandler from '../../error/handler'
import type { IRefreshToken, IUser } from '../../interface/user'
import { omit } from '../../utils/utils'

const model = {
	login: async (account: string, pwd: string): Promise<IRefreshToken> => {
		try {
			const projection = omit(config.database.projection.IRefreshToken, ['pwd'])

			const user = await dbModel.findOne({ account }, projection).lean()

			const isMatch = user != null && (await bcrypt.compare(pwd, user.pwd))

			if (user == null || !isMatch) {
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid account or password',
				)
			}

			delete (user as Partial<IUser>).pwd

			return user
		} catch (e) {
			errorHandler.allErrors(
				e as CustomError,
				new DatabaseError(
					'Failed to access data',
					'The user was not retrieved, something went wrong please try again',
				),
			)
			throw new DatabaseError(
				'Failed to access data',
				'The user was not retrieved, something went wrong please try again',
			)
		}
	},
	exists: async (account: string): Promise<boolean> => {
		try {
			const exists = await dbModel.exists({ account })
			if (exists === null) throw new NotFound('User not found')
			return true
		} catch (e) {
			errorHandler.allErrors(
				e as CustomError,
				new DatabaseError(
					'Failed to access data',
					'The user was not retrieved, something went wrong please try again',
				),
			)
			throw new DatabaseError(
				'Failed to access data',
				'The user was not retrieved, something went wrong please try again',
			)
		}
	},
	refreshToken: {
		save: async (token: string, userId: Types.ObjectId): Promise<boolean> => {
			try {
				const user = await dbModel.findOne(
					{ _id: userId },
					{ _id: 0, refreshToken: 1 },
				)

				if (user == null) throw new NotFound('User not found')
				if (Array.isArray(user.refreshToken) && user.refreshToken.length >= 3) {
					await dbModel.updateOne(
						{ _id: userId },
						{ refreshToken: user.refreshToken.slice(1) },
					)
				}

				const result = await dbModel.updateOne(
					{ _id: userId },
					{ $push: { refreshToken: token } },
				)

				return result.matchedCount === 1 && result.modifiedCount === 1
			} catch (e) {
				errorHandler.allErrors(
					e as CustomError,
					new DatabaseError(
						'Failed to save',
						'The session was not saved, something went wrong please try again',
					),
				)
				throw new DatabaseError(
					'Failed to save',
					'The session was not saved, something went wrong please try again',
				)
			}
		},
		remove: async (token: string, userId: Types.ObjectId): Promise<boolean> => {
			try {
				const result = await dbModel.updateOne(
					{ _id: userId },
					{ $pull: { refreshToken: token } },
				)

				if (result.matchedCount === 0) throw new NotFound('User not found')
				return result.matchedCount === 1 && result.modifiedCount === 1
			} catch (e) {
				errorHandler.allErrors(
					e as CustomError,
					new DatabaseError(
						'Failed to remove',
						'The session was not removed, something went wrong please try again',
					),
				)
				throw new DatabaseError(
					'Failed to remove',
					'The session was not removed, something went wrong please try again',
				)
			}
		},
		verify: async (token: string, userId: Types.ObjectId): Promise<boolean> => {
			try {
				const result = await dbModel
					.findOne({ _id: userId }, { refreshToken: 1, _id: 0 })
					.lean()

				if (result === null) throw new NotFound('User not found')

				const tokens = result?.refreshToken
				return Array.isArray(tokens) && tokens.includes(token)
			} catch (e) {
				errorHandler.allErrors(
					e as CustomError,
					new DatabaseError(
						'Failed to access data',
						'The user was not retrieved, something went wrong please try again',
					),
				)
				throw new DatabaseError(
					'Failed to access data',
					'The user was not retrieved, something went wrong please try again',
				)
			}
		},
	},
}

export default model
