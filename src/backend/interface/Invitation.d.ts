import type { Types } from 'mongoose'
export interface IInvitation {
	_id: Types.ObjectId
	account: string
	color: string
	name: string
}
