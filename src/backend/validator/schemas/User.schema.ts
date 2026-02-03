import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'
import PasswordSchema from './Password.schema'

export const UserSchema = z.object({
	fullName: z
		.string()
		.min(1, 'fullName is required')
		.max(100, 'fullName must be at most 100 characters'),
	account: z
		.string()
		.min(1, 'account is required')
		.max(100, 'account must be at most 100 characters')
		.email('Invalid account'),
	pwd: PasswordSchema,
	nickName: z
		.string()
		.min(1, 'nickName is required')
		.max(100, 'nickName must be at most 100 characters')
		.nullable(),
})

export const UserSchemaPartial = UserSchema.partial()

export type UserType = z.infer<typeof UserSchema>

export const UserValidator = CreateValidator<typeof UserSchema, UserType>(
	UserSchema,
)

export const UserPartialValidator = CreateValidator<
	typeof UserSchemaPartial,
	Partial<UserType>
>(UserSchema.partial())
