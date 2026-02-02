import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

export const GroupSchema = z.object({
	name: z
		.string()
		.min(1, 'name is required')
		.max(100, 'name must be 100 characters long'),
	color: z
		.string()
		.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex code'),
	repository: z.string().url('Must be a valid url').nullable(),
})

export const GroupSchemaPartial = GroupSchema.partial()

export type GroupType = z.infer<typeof GroupSchema>

export const GroupValidator = CreateValidator<typeof GroupSchema, GroupType>(
	GroupSchema,
)

export const GroupPartialValidator = CreateValidator<
	typeof GroupSchemaPartial,
	Partial<GroupType>
>(GroupSchema.partial())
