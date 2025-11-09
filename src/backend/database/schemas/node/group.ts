import { model, Schema } from 'mongoose'
import config from './../../../config/config'
import { IGroup } from '../../../interface/group'

const { ObjectId } = Schema.Types

const techLeadSchema = new Schema<IGroup['techLead'][number]>({
  fullName: { type: String, require: true },
  _id: { type: ObjectId, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const memberSchema = new Schema<IGroup['member'][number]>({
  _id: { type: ObjectId, require: true },
  fullName: { type: String, require: true },
  role: { type: String, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema<IGroup>({
  _id: { type: ObjectId },
  techLead: [{ type: techLeadSchema, require: true }],
  name: { type: String, require: true },
  repository: { type: String },
  member: [memberSchema]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'group'
})

export default model<IGroup>('group', schema)
