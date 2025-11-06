import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const groupSchema = new Schema({
  name: { type: String },
  _id: { type: Schema.Types.ObjectId },
  color: { type: String }
}, { _id: false })

const schema = new Schema({
  fullName: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  nickName: { type: String },
  refreshToken: [{ type: String }],
  invitation: [{
    type: groupSchema
  }],
  group: [{
    type: groupSchema
  }]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'user'
})

export default model('user', schema)
