import type { Types } from 'mongoose'

export interface IUserGroup {
	groupId: Types.ObjectId
	account: string
	role: string
}
