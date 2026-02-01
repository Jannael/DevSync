import { Schema } from 'mongoose'
import config from '../../config/Config'
import type { ICodeSchema } from '../../interface/CodeField'

const CodeSchema = new Schema<ICodeSchema>(
	{
		language: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		_id: false,
	},
)

export default CodeSchema
