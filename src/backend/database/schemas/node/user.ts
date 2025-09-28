import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const { ObjectId } = Schema.Types

const personalizationSchema = new Schema({
  theme: { type: String }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema({
  _id: { type: ObjectId },
  fullName: { type: String, require: true },
  account: { type: String, require: true, unique: true },
  pwd: { type: String, require: true },
  role: [{ type: String }],
  nickName: { type: String },
  personalization: personalizationSchema,
  refreshToken: [{ type: String }]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'user'
})

export default model('user', schema)
