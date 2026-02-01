import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { IUserGroup } from '../../interface/UserGroup'

// here i used the _id as the groupId so i the database does not create a a new _id for each document

const schema = new Schema<IUserGroup>(
	{
		groupId: { type: Schema.Types.ObjectId, required: true }, // groupId
		account: { type: String, required: true },
		role: { type: String, required: true },
	},
	{
		...config.schemaOptions,
		_id: false,
	}
)

export default model<IUserGroup>('userGroup', schema)
