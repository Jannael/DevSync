import bcrypt from 'bcrypt'
import type { Types } from 'mongoose'
import dbModel from '../database/node/User'
import { env } from '../Env.validator'
import { DatabaseError } from '../error/Error.instance'
import type { IUser } from '../interface/User'
import CreateModel from '../utils/helper/CreateModel.helper'

const { BCRYPT_SALT_HASH } = env

const UserModel = {
	Get: CreateModel<
		{
			account: string
			projection: Partial<Record<keyof IUser, 0 | 1>>
		},
		IUser
	>({
		Model: async ({ account, projection }, session) => {
			const user = await dbModel
				.findOne({ account }, projection, { session })
				.lean<IUser>()
			if (!user) return

			return user
		},
		DefaultError: new DatabaseError('Failed to access data'),
	}),
	Create: CreateModel<
		{ data: Omit<IUser, 'refreshToken' | '_id'> },
		IUser
	>({
		Model: async ({ data }, session) => {
			const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
			const hashedPwd = await bcrypt.hash(data.pwd, salt)
			const payload = { ...data, pwd: hashedPwd }

			const user = await dbModel.create([payload], { session })
			return user[0].toObject()
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not created, something went wrong please try again',
		),
	}),
	Update: CreateModel<{ data: Partial<IUser>; _id: Types.ObjectId }, boolean>({
		Model: async ({ data, _id }, session) => {
			if (data.pwd) {
				const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
				const pwd = await bcrypt.hash(data.pwd, salt)
				data.pwd = pwd
			}

			const updated = await dbModel.updateOne({ _id }, data, { session })
			return updated.acknowledged
		},
		DefaultError: new DatabaseError(
			'Failed to save',
			'The user was not updated, something went wrong please try again',
		),
	}),
	Delete: CreateModel<{ _id: Types.ObjectId }, boolean>({
		Model: async ({ _id }, session) => {
			const result = await dbModel.deleteOne({ _id }, { session })
			return result.acknowledged && result.deletedCount === 1
		},
		DefaultError: new DatabaseError(
			'Failed to remove',
			'The user was not deleted, something went wrong please try again',
		),
	}),
}

export default UserModel
