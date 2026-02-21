import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

export const GroupSchema = z.object({
	name: z
		.string('Name is required')
		.min(1, 'Name is required')
		.max(100, 'Name must be 100 characters long'),
	color: z
		.string('Color is required')
		.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex code')
		.transform((val) => val ?? '#000000'),
	repository: z
		.string('Repository is required')
		.url('Must be a valid url')
		.nullable()
		.transform((val) => val ?? 'https://github.com/'),
})

export const GroupSchemaPartial = GroupSchema.partial()

export type GroupType = z.infer<typeof GroupSchema>

export const GroupValidator = CreateValidator<typeof GroupSchema, GroupType>(
	GroupSchema,
)

export const GroupPartialValidator = CreateValidator<
	typeof GroupSchemaPartial,
	Partial<GroupType>
>(GroupSchemaPartial)
