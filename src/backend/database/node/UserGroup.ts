import { model, Schema } from 'mongoose'
import config from '../../config/Config'
import type { IUserGroup } from '../../interface/UserGroup'

// here i used the _id as the groupId so i the database does not create a a new _id for each document

const schema = new Schema<IUserGroup>(
	{
		_id: { type: Schema.Types.ObjectId, required: true }, // groupId
		account: { type: String, required: true },
		name: { type: String, required: true },
		color: { type: String, required: true },
	},
	{
		...config.database.mongodb.schemaOptions,
		_id: false,
	},
)

export default model<IUserGroup>('userGroup', schema)
