import { Types } from 'mongoose'
import z from 'zod'
import { UserBadRequest } from '../../error/error'
import type { ITask } from '../../interface/Task'

export const codeSchema = z.object({
	language: z.enum(['js'], {
		message: 'code.language must be one of: js',
	}),
	content: z
		.string('code.content must be str')
		.min(1, { message: 'code.content must be at least < 1 length' })
		.max(500, { message: 'code.content must be > 500 length' }),
})

const baseSchema = z.object({
	groupId: z.string().refine((val) => Types.ObjectId.isValid(val), {
		message: 'The groupId string is invalid.',
	}),
	user: z
		.array(
			z
				.string('user array must be account[]')
				.email('Invalid account at user array'),
		)
		.refine((arr) => new Set(arr).size === arr.length, {
			message:
				'The user array must contain only unique elements (no duplicates).',
		}),
	name: z
		.string('name must be a string')
		.min(1, { message: 'name must be at least < 1 length' })
		.max(250, { message: 'name must be > 250 length' }),
	code: codeSchema,
	feature: z
		.array(
			z
				.string('feature array must be string[]')
				.min(1, { message: 'feature must be at least < 1 length' })
				.max(250, { message: 'feature must be > 250 length' }),
		)
		.refine((arr) => new Set(arr).size === arr.length, {
			message:
				'The feature array must contain only unique elements (no duplicates).',
		}),
	description: z
		.string('description must be a string, and must be < 500 length')
		.min(1, { message: 'description must be at least < 1 length' })
		.max(500, { message: 'description must be > 500 length' }),
	isComplete: z.boolean('isComplete must be bool'),
	priority: z
		.number('Priority must be a number between 0-10')
		.min(0, { message: 'Priority must be >= 0' })
		.max(10, { message: 'Priority must be <= 10' }),
})

const creationSchema = baseSchema.extend({
	isComplete: baseSchema.shape.isComplete.default(false),
	priority: baseSchema.shape.priority.default(0),
	user: baseSchema.shape.user.optional(),
	description: baseSchema.shape.description.optional(),
	code: baseSchema.shape.code.optional(),
	feature: baseSchema.shape.feature.optional(),
})

const validator = {
	create: (task: ITask) => {
		try {
			const result = creationSchema.parse(task)
			return result
		} catch (e) {
			throw new UserBadRequest(
				'Invalid credentials',
				JSON.parse((e as Error).message)[0].message,
			)
		}
	},
	partial: (task: Partial<ITask>) => {
		try {
			const result = baseSchema.partial().parse(task)
			return result
		} catch (e) {
			throw new UserBadRequest(
				'Invalid credentials',
				JSON.parse((e as Error).message)[0].message,
			)
		}
	},
}

export default validator
