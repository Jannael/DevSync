import type { Types } from 'mongoose'
import type { ICodeSchema } from './CodeField'

export interface ISolution {
	_id: Types.ObjectId
	user: string
	groupId: Types.ObjectId
	feature: string[] | null
	code: ICodeSchema | null
	description: string
}
