import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const { ObjectId } = Schema.Types

const codeSchema = new Schema({
  language: { type: String, required: true },
  content: { type: String, required: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema({
  groupId: { type: ObjectId },
  user: [{ type: String, ref: 'user' }],
  name: { type: String, required: true },
  code: codeSchema,
  feature: [{ type: String }],
  description: { type: String },
  isComplete: { type: Boolean },
  priority: { type: Number }
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'task'
})

export default model('task', schema)
