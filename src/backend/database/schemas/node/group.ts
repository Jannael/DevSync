import mongoose from 'mongoose'
import config from './../../../config/config'
const { Schema } = mongoose

const techLeadSchema = new Schema({
  fullName: { type: String, require: true },
  _id: { type: Schema.Types.ObjectId, require: true }
}, {
  ...config.database.mongodb.schemaOptions,
  _id: false
})

const schema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  techLead: { type: techLeadSchema, require: true },
  name: { type: String, require: true },
  repository: { type: String },
  member: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'group'
})

export default schema
