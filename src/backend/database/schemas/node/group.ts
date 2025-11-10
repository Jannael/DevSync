import { model, Schema } from 'mongoose'
import config from './../../../config/config'
import { IGroup } from '../../../interface/group'

const techLeadSchema = new Schema<NonNullable<IGroup['member']>[number]>({
  fullName: { type: String, require: true },
  account: { type: String, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const memberSchema = new Schema<NonNullable<IGroup['member']>[number]>({
  account: { type: String, require: true },
  fullName: { type: String, require: true },
  role: { type: String, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema<IGroup>({
  techLead: [{ type: techLeadSchema, require: true }],
  name: { type: String, require: true },
  repository: { type: String },
  color: { type: String },
  member: [memberSchema]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'group'
})

export default model<IGroup>('group', schema)
