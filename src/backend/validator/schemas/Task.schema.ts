import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

export const TaskSchema = z.object({
	_id: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid task id' },
	),
	groupId: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid group id' },
	),
	user: z.array(z.string().email('user item is invalid')).nullable(),
	name: z
		.string()
		.min(1, 'name is required')
		.max(100, 'name must be at most 100 characters'),
	code: z
		.object({
			language: z
				.string()
				.min(1, 'language is required')
				.max(100, 'language must be at most 100 characters'),
			content: z.string().min(1, 'content is required'),
		})
		.nullable(),
	feature: z
		.array(
			z
				.string()
				.min(1, 'feature item is required')
				.max(100, 'feature item must be at most 100 characters'),
		)
		.nullable(),
	description: z
		.string()
		.min(1, 'description is required')
		.max(1000, 'description must be at most 1000 characters'),
	isComplete: z.boolean('isComplete is invalid').default(false),
	priority: z.number('priority is invalid').default(0),
})

export const TaskSchemaPartial = TaskSchema.partial()

export type TaskType = z.infer<typeof TaskSchema>

export const TaskValidator = CreateValidator<typeof TaskSchema, TaskType>(
	TaskSchema,
)

export const TaskPartialValidator = CreateValidator<
	typeof TaskSchemaPartial,
	Partial<TaskType>
>(TaskSchema.partial())
