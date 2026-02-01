import type { Types } from 'mongoose'
export interface ITaskListItem {
	_id: Types.ObjectId
	name: string
	priority: number | null | undefined
	isComplete: boolean | null | undefined
	user: string[]
}

export interface IListTask {
	task: ITaskListItem[]
	assign: Types.ObjectId[]
}
