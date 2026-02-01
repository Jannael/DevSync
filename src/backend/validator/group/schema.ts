import z from 'zod'
import { UserBadRequest } from '../../error/error'
import type { IGroup } from '../../interface/Group'

const schema = z.object({
	techLead: z
		.array(
			z.object({
				fullName: z
					.string('techLead fullName is required')
					.min(3, {
						message: 'techLead fullName must be at least 3 characters long',
					})
					.max(255, {
						message: 'techLead fullName must be at most 255 characters long',
					}),
				account: z.string('techLead account is required').email(),
			}),
		)
		.refine((arr) => new Set(arr).size === arr.length, {
			message:
				'The techLead array must contain only unique elements (no duplicates).',
		})
		.optional(),
	name: z
		.string('name is required')
		.min(3, { message: 'name must be at least 3 characters long' })
		.max(100, { message: 'name must be at most 100 characters long' }),
	repository: z.string().url().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, 'color must be a valid hex code'),
	member: z
		.array(
			z.object({
				account: z.string('member.account is required').email(),
				fullName: z
					.string('member.fullName is required')
					.min(3, {
						message: 'member.fullName must be at least 3 characters long',
					})
					.max(255, {
						message: 'member.fullName must be at most 255 characters long',
					}),
				role: z.enum(['developer', 'documenter'], {
					message:
						'member.role is required and must be one of: developer, documenter',
				}),
			}),
		)
		.refine((arr) => new Set(arr).size === arr.length, {
			message:
				'The member array must contain only unique elements (no duplicates).',
		})
		.optional(),
})

const validator = {
	create: (obj: Omit<IGroup, '_id'>) => {
		try {
			const result = schema.parse(obj)
			return result
		} catch (e) {
			throw new UserBadRequest(
				'Invalid credentials',
				JSON.parse((e as Error).message)[0].message,
			)
		}
	},
	partial: (obj: Partial<IGroup>) => {
		try {
			const result = schema.partial().parse(obj)
			return result
		} catch (e) {
			throw new UserBadRequest(
				'Invalid credentials',
				JSON.parse((e as Error).message)[0].message,
			)
		}
	},
	member: (obj: IGroup['member']) => {
		try {
			const result = schema.shape.member.parse(obj)
			return result
		} catch (e) {
			throw new UserBadRequest(
				'Invalid credentials',
				JSON.parse((e as Error).message)[0].message,
			)
		}
	},
	role: (role: string) => {
		const roles = ['techLead', 'documenter', 'developer']
		if (!roles.includes(role))
			throw new UserBadRequest(
				'Invalid credentials',
				'The role must be one of: techLead, documenter, developer',
			)
		return true
	},
}

export default validator
