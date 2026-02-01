import type { Types } from 'mongoose'

export interface IGroup {
	_id: Types.ObjectId
	name: string
	color: string
	repository: string | null
}
