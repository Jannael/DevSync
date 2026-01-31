import { model, Schema } from 'mongoose'
import config from '../../../config/config'

const { ObjectId } = Schema.Types

const codeSchema = new Schema(
	{
		language: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		_id: false,
	},
)

const schema = new Schema(
	{
		_id: { type: ObjectId, required: true }, // taskId
		user: { type: String, required: true },
		groupId: { type: ObjectId, required: true },
		feature: [{ type: String }],
		code: codeSchema,
		description: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		collection: 'solution',
	},
)

export default model('solution', schema)
