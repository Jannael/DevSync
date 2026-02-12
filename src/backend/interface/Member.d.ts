import type { Types } from 'mongoose'

export interface IMemberCollection {
	groupId: Types.ObjectId
	account: string
	role: string
	isInvitation: boolean
}

export interface IMember extends Omit<IMemberCollection, 'isInvitation'> {}

export interface IMemberReturn extends Omit<IMember, 'account'> {}
