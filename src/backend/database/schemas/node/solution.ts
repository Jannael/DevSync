import { Schema } from 'mongoose'
import config from '../../../config/config'

const schema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  userId: { type: String },
  groupId: {}
})
