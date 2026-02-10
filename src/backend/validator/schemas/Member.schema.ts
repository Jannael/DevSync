import { Types } from 'mongoose'
import { z } from 'zod'
import Roles from '../../constant/Role.constant'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

export const MemberSchema = z.object({
	groupId: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid group id' },
	),
	account: z.string('Account is required').email('Invalid account'),
	role: z.enum([Roles.developer, Roles.documenter, Roles.techLead], {
		message: 'Invalid role',
	}),
})

export const MemberSchemaPartial = MemberSchema.partial()

export type MemberType = z.infer<typeof MemberSchema>

export const MemberValidator = CreateValidator<typeof MemberSchema, MemberType>(
	MemberSchema,
)

export const MemberPartialValidator = CreateValidator<
	typeof MemberSchemaPartial,
	Partial<MemberType>
>(MemberSchema.partial())
