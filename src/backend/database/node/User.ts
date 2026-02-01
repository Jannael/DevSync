import { model, Schema } from 'mongoose'
import config from '../../config/Database.config'
import type { IUser } from '../../interface/User'

const schema = new Schema<IUser>(
	{
		fullName: { type: String, required: true },
		account: { type: String, required: true, unique: true },
		pwd: { type: String, required: true },
		nickName: { type: String },
		refreshToken: [{ type: String }],
	},
	{
		...config.schemaOptions,
		collection: 'user',
	},
)

export default model<IUser>('user', schema)
