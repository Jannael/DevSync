import type { Types } from 'mongoose'

export interface IMember {
	groupId: Types.ObjectId
	account: string
	role: string
	isInvitation: boolean
}
