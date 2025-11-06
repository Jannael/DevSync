import { model, Schema } from 'mongoose'
import config from '../../../config/config'
import { IUser, IUserInvitation } from '../../../interface/user'

const groupSchema = new Schema<IUserInvitation>({
  name: { type: String, required: true },
  _id: { type: Schema.Types.ObjectId, required: true },
  color: { type: String, required: true }
}, { _id: false, versionKey: false })

const schema = new Schema({
  fullName: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  nickName: { type: String },
  refreshToken: [{ type: String }],
  invitation: [groupSchema],
  group: [groupSchema]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'user'
})

export default model<IUser>('user', schema)
