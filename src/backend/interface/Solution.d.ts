import type { Types } from 'mongoose'

export interface ISolution {
	_id: Types.ObjectId
	user: string
	groupId: Types.ObjectId
	feature: string[] | null
	code: {
		language: string
		content: string
	} | null
	description: string
}
