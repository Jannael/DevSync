import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

export const InvitationSchema = z.object({
	_id: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid invitation id' },
	),
	account: z.string().email('Invalid account'),
})

export const InvitationSchemaPartial = InvitationSchema.partial()

export type InvitationType = z.infer<typeof InvitationSchema>

export const InvitationValidator = CreateValidator<
	typeof InvitationSchema,
	InvitationType
>(InvitationSchema)

export const InvitationPartialValidator = CreateValidator<
	typeof InvitationSchemaPartial,
	Partial<InvitationType>
>(InvitationSchema.partial())
