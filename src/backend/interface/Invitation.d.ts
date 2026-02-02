import type { Types } from 'mongoose'
export interface IInvitation {
	groupId: Types.ObjectId
	account: string
	role: string
}
