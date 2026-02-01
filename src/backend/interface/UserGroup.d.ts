import type { Types } from 'mongoose'

export interface IUserGroup {
	_id: Types.ObjectId // => groupId
	account: string
	name: string
	color: string
}
