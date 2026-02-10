import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'
import CodeFieldSchema from './CodeField.schema'

export const SolutionSchema = z.object({
	_id: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid solution id' },
	),
	user: z.string().email('Invalid user'),
	groupId: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid group id' },
	),
	feature: z
		.array(
			z
				.string()
				.min(1, 'feature item is required')
				.max(100, 'feature item must be at most 100 characters'),
		)
		.nullable(),
	code: CodeFieldSchema,
	description: z
		.string('Description is required')
		.min(1, 'Description is required')
		.max(1000, 'Description must be at most 1000 characters'),
})

export const SolutionSchemaPartial = SolutionSchema.pick({
	code: true,
	description: true,
	feature: true,
}).partial()

export type SolutionType = z.infer<typeof SolutionSchema>

export const SolutionValidator = CreateValidator<
	typeof SolutionSchema,
	SolutionType
>(SolutionSchema)

export const SolutionPartialValidator = CreateValidator<
	typeof SolutionSchemaPartial,
	Partial<SolutionType>
>(SolutionSchema.partial())
