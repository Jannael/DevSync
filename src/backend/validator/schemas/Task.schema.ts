import { Types } from 'mongoose'
import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'
import CodeFieldSchema from './CodeField.schema'

export const TaskBaseSchema = z.object({
	groupId: z.custom<Types.ObjectId>(
		(val) => {
			return Types.ObjectId.isValid(val as string | number)
		},
		{ message: 'Invalid group id' },
	),
	user: z.array(z.string('User is required').email('User is invalid')).nullable(),
	name: z
		.string('Name is required')
		.min(1, 'Name is required')
		.max(100, 'Name must be at most 100 characters'),
	code: CodeFieldSchema,
	feature: z
		.array(
			z
				.string('Feature item is required')
				.min(1, 'Feature item is required')
				.max(100, 'Feature item must be at most 100 characters'),
		)
		.nullable(),
	description: z
		.string('Description is required')
		.min(1, 'Description is required')
		.max(1000, 'Description must be at most 1000 characters'),
	isComplete: z.boolean('IsComplete is invalid'),
	priority: z.number('Priority is invalid'),
})

export const TaskSchema = TaskBaseSchema.extend({
	isComplete: TaskBaseSchema.shape.isComplete.default(false),
	priority: TaskBaseSchema.shape.priority.default(0),
})

export const TaskSchemaUpdate = TaskBaseSchema.omit({ groupId: true })
export const TaskSchemaPartial = TaskSchemaUpdate.partial()

export type TaskType = z.infer<typeof TaskSchema>

export const TaskValidator = CreateValidator<typeof TaskSchema, TaskType>(
	TaskSchema,
)

export const TaskPartialValidator = CreateValidator<
	typeof TaskSchemaPartial,
	Partial<TaskType>
>(TaskSchemaPartial)
