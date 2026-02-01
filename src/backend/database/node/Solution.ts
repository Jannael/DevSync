import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { ISolution } from '../../interface/Solution'
import CodeSchema from './CodeField'

const { ObjectId } = Schema.Types

const schema = new Schema<ISolution>(
	{
		_id: { type: ObjectId, required: true }, // taskId
		user: { type: String, required: true },
		groupId: { type: ObjectId, required: true },
		feature: [{ type: String }],
		code: CodeSchema,
		description: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		collection: 'solution',
	},
)

export default model<ISolution>('solution', schema)
