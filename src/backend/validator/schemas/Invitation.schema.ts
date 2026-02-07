import type { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'
import { MemberSchema as InvitationSchema } from './Member.schema'

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
