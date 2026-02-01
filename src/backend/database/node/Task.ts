import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { ITask } from '../../interface/Task'
import CodeSchema from './CodeField'

const { ObjectId } = Schema.Types

const schema = new Schema<ITask>(
	{
		groupId: { type: ObjectId, required: true },
		user: [{ type: String }],
		name: { type: String, required: true },
		code: CodeSchema,
		feature: [{ type: String }],
		description: { type: String, required: true },
		isComplete: { type: Boolean, required: true }, // => default false
		priority: { type: Number, required: true }, // => default 0
	},
	{
		...config.schemaOptions,
		collection: 'task',
	},
)

export default model<ITask>('task', schema)
