import type { Types } from 'mongoose'
import type { IMember } from './Member'
export interface IGroup {
	_id: Types.ObjectId
	name: string
	color: string
	repository: string | null
}
export interface IUserGroups extends Omit<IMember, 'account'> {
	name: string
	color: string
}
