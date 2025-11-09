import { Types } from 'mongoose'

export interface IGroup {
  _id: Types.ObjectId
  techLead: {
    _id: Types.ObjectId
    fullName: string
  }
  name: string
  repository?: string
  member: Array<{
    _id: Types.ObjectId
    fullName: string
    role: string
  }>
}
