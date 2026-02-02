import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

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
	code: z
		.object({
			language: z
				.string()
				.min(1, 'language is required')
				.max(100, 'language must be at most 100 characters'),
			content: z.string().min(1, 'content is required'),
		})
		.nullable(),
	description: z
		.string()
		.min(1, 'description is required')
		.max(1000, 'description must be at most 1000 characters'),
})

export const SolutionSchemaPartial = SolutionSchema.partial()

export type SolutionType = z.infer<typeof SolutionSchema>

export const SolutionValidator = CreateValidator<
	typeof SolutionSchema,
	SolutionType
>(SolutionSchema)

export const SolutionPartialValidator = CreateValidator<
	typeof SolutionSchemaPartial,
	Partial<SolutionType>
>(SolutionSchema.partial())
