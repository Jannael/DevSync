import type { Types } from 'mongoose'

export interface IUser {
	_id: Types.ObjectId
	fullName: string
	account: string
	nickName?: string | null
	// exclude in refreshToken
	refreshToken: string[] | null
	pwd: string
}

// refreshToken and accessToken have the same information
export interface IRefreshToken extends Omit<IUser, 'refreshToken' | 'pwd'> {}
