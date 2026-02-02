import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { IMemberCollection } from '../../interface/Member'

// here i used the _id as the groupId so i the database does not create a a new _id for each document

const schema = new Schema<IMemberCollection>(
	{
		groupId: { type: Schema.Types.ObjectId, required: true }, // groupId
		account: { type: String, required: true },
		role: { type: String, required: true },
		isInvitation: { type: Boolean, required: true },
	},
	{
		...config.schemaOptions,
		_id: false,
	},
)

export default model<IMemberCollection>('member', schema)
