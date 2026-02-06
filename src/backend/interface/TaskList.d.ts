import type { Types } from 'mongoose'
import type { IPagination } from './Pagination'
export interface ITaskListItem {
	_id: Types.ObjectId
	name: string
	priority: number | null | undefined
	isComplete: boolean | null | undefined
	user: string[]
}

export interface ITaskList extends IPagination {
	task: ITaskListItem[]
	assign: Types.ObjectId[] // task id for the tasks the user is assigned to
}
