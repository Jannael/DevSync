import { model, Schema } from 'mongoose'
import config from '../../../config/Config'
import type { ICodeSchema, ITask } from '../../../interface/task'

const { ObjectId } = Schema.Types

const codeSchema = new Schema<ICodeSchema>(
	{
		language: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		_id: false,
	},
)

const schema = new Schema<ITask>(
	{
		groupId: { type: ObjectId, required: true },
		user: [{ type: String }],
		name: { type: String, required: true },
		code: codeSchema,
		feature: [{ type: String }],
		description: { type: String },
		isComplete: { type: Boolean },
		priority: { type: Number },
	},
	{
		...config.database.mongodb.schemaOptions,
		collection: 'task',
	},
)

export default model<ITask>('task', schema)
