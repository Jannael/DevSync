import type { Types } from 'mongoose'

export interface IGroup {
	_id: Types.ObjectId
	techLead: Array<{
		account: string
		fullName: string
	}>
	name: string
	color: string
	repository: string | null
	member: Array<{
		account: string
		fullName: string
		role: string
	}> | null
}
