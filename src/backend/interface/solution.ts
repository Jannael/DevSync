import type { Types } from 'mongoose'

export interface ISolution {
	_id: Types.ObjectId
	user: string
	groupId: Types.ObjectId
	feature: string[]
	code: {
		language: string
		content: string
	}
	description: string
}
