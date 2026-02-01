import { Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { ICodeSchema } from '../../interface/CodeField'

const CodeSchema = new Schema<ICodeSchema>(
	{
		language: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		_id: false,
	},
)

export default CodeSchema
