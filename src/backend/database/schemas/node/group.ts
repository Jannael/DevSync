import mongoose from 'mongoose'
import config from './../../../config/config'
const { Schema } = mongoose

const techLeadSchema = new Schema({
  fullName: { type: String },
  _id: { type: Schema.Types.ObjectId }
})

const schema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  techLead: techLeadSchema
}, {
  ...config.database.mongodb.schemaOptions,
  collection: 'group'
})

export default schema
