import { Types } from 'mongoose'
import z from 'zod'
import { UserBadRequest } from '../../error/error'
import type { IUserGroup } from '../../interface/user'

const groupSchema = z.object({
	_id: z.instanceof(Types.ObjectId, {
		message: 'Invalid _id format',
	}),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, 'color must be a valid hex code'),
	name: z
		.string('Name is required')
		.min(3, { message: 'Name must be at least 3 characters long' })
		.max(100, { message: 'Name must be at most 100 characters long' }),
})

const validator = {
	add: (obj: IUserGroup) => {
		try {
			const result = groupSchema.parse(obj)
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
