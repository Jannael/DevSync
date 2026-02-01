import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import type { Types } from 'mongoose'
import dbModel from '../database/node/User'
import { DatabaseError } from '../error/error'
import type { IEnv } from '../interface/Env'
import type { IRefreshToken, IUser } from '../interface/User'
import CreateModel from '../utils/helpers/CreateModel.helper'

dotenv.config({ quiet: true })
const { BCRYPT_SALT_HASH } = process.env as Pick<IEnv, 'BCRYPT_SALT_HASH'>

const UserModel = {
	Get: CreateModel<
		{
			account: string
			projection: Record<string, number>
		},
		Partial<IRefreshToken> | null
	>({
		Model: async ({ account, projection }) => {
			const user = await dbModel
				.findOne({ account }, { _id: 0, ...projection })
				.lean<Partial<IRefreshToken>>()

			return user
		},
		DefaultError: new DatabaseError('Failed to access data'),
	}),
	Create: CreateModel<{ data: IUser }, IRefreshToken>({
		Model: async ({ data }) => {
			const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
			const hashedPwd = await bcrypt.hash(data.pwd, salt)
			const payload = { ...data, pwd: hashedPwd }

			const user = await dbModel.create(payload)
			return user
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not created, something went wrong please try again',
		),
	}),
	Update: CreateModel<
		{ data: Omit<Partial<IUser>, 'account'>; _id: Types.ObjectId },
		boolean
	>({
		Model: async ({ data, _id }) => {
			if (data.pwd) {
				const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
				const pwd = await bcrypt.hash(data.pwd, salt)
				data.pwd = pwd
			}

			const updated = await dbModel.updateOne({ _id }, { ...data })
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }) => {
			const result = await dbModel.deleteOne({ _id })
			return result.acknowledged && result.deletedCount === 1
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The user was not deleted, something went wrong please try again',
		),
	}),
	AccountUpdate: CreateModel<{ _id: Types.ObjectId; account: string }, boolean>(
		{
			Model: async ({ _id, account }) => {
				const response = await dbModel.updateOne({ _id }, { account })
				return response.acknowledged
			},
			DefaultError: new DatabaseError(
				'Failed to save',
				'The account was not updated, something went wrong please try again',
			),
		},
	),
}

export default UserModel
