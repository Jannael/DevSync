import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'
import PasswordSchema from './Password.schema'

export const UserSchema = z.object({
	fullName: z
		.string('FullName is required')
		.min(1, 'FullName is required')
		.max(100, 'FullName must be at most 100 characters'),
	account: z
		.string('Account is required')
		.max(100, 'account must be at most 100 characters')
		.email('Invalid account'),
	pwd: PasswordSchema,
	nickName: z
		.string('NickName is required')
		.min(1, 'NickName is required')
		.max(100, 'NickName must be at most 100 characters')
		.optional(),
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
