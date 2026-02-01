import type { Types } from 'mongoose'
import type { ICodeSchema } from './CodeField'

export interface ITask {
	_id: Types.ObjectId
	groupId: Types.ObjectId
	user: string[] | null
	name: string
	code: ICodeSchema | null
	feature: string[] | null
	description: string
	isComplete: boolean // => default false
	priority: number // => default 0
}
