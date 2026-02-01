import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { IGroup } from '../../interface/Group'

const techLeadSchema = new Schema<IGroup['techLead'][number]>(
	{
		fullName: { type: String, required: true },
		account: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		_id: false,
	},
)

const memberSchema = new Schema<IGroup['member']>(
	{
		account: { type: String, required: true },
		fullName: { type: String, required: true },
		role: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		_id: false,
	},
)

const schema = new Schema<IGroup>(
	{
		techLead: [{ type: techLeadSchema, required: true }],
		name: { type: String, required: true },
		repository: { type: String },
		color: { type: String, required: true },
		member: [memberSchema],
	},
	{
		...config.schemaOptions,
		collection: 'group',
	},
)

export default model<IGroup>('group', schema)
