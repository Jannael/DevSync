import { Types } from 'mongoose'

export interface ICodeSchema {
  language: string
  content: string
}

export interface ITask {
  _id: Types.ObjectId
  groupId: Types.ObjectId
  user: string[]
  name: string
  code: ICodeSchema
  feature: string[]
  description: string
  isComplete: boolean
  priority: number
}

export interface ITaskProjection {
  _id: Types.ObjectId
  name: string
  priority: number | null | undefined
  isComplete: boolean | null | undefined
}

export interface IListTask {
  task: ITaskProjection[]
  assign: Types.ObjectId[]
}
