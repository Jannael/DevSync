import { model, Schema } from 'mongoose'
import config from '../../config/Config'
import type { IInvitation } from '../../interface/Invitation'

const schema = new Schema<IInvitation>(
	{
		_id: { type: Schema.Types.ObjectId, required: true },
		account: { type: String, required: true },
		color: { type: String, required: true },
		name: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		_id: false,
	},
)

export default model<IInvitation>('invitation', schema)
