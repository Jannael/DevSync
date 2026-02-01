import type { Types } from 'mongoose'

export interface IUser {
	_id: Types.ObjectId
	fullName: string
	account: string
	pwd: string
	nickName: string | null
	refreshToken: string[] | null
}

// refreshToken and accessToken have the same information
export interface IRefreshToken extends Omit<IUser, 'refreshToken' | 'pwd'> {}
