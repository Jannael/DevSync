import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const { ObjectId } = Schema.Types

const codeSchema = new Schema({
  language: { type: String, require: true },
  content: { type: String, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema({
  _id: { type: ObjectId },
  userId: { type: ObjectId },
  groupId: { type: ObjectId },
  taskId: { type: ObjectId },
  feature: [{
    type: String
  }],
  code: codeSchema,
  description: { type: String, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'solution'
})

export default model('solution', schema)
