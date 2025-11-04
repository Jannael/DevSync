import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const invitationSchema = new Schema({
  name: { type: String },
  _id: { type: Schema.Types.ObjectId }
}, { _id: false })

const schema = new Schema({
  fullName: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  role: [{ type: String }],
  nickName: { type: String },
  refreshToken: [{ type: String }],
  invitation: [{
    type: invitationSchema,
    required: false
  }]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'user'
})

export default model('user', schema)
