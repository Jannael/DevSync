import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { IGroup } from '../../interface/Group'

const schema = new Schema<IGroup>(
	{
		name: { type: String, required: true },
		repository: { type: String },
		color: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		collection: 'group',
	},
)

export default model<IGroup>('group', schema)
