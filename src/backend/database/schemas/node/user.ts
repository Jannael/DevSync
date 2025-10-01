import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const personalizationSchema = new Schema({
  theme: { type: String }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema({
  fullName: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  role: [{ type: String }],
  nickName: { type: String },
  personalization: personalizationSchema,
  refreshToken: [{ type: String }]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'user'
})

export default model('user', schema)
