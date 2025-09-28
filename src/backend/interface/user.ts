import { Schema } from 'mongoose'

const { ObjectId } = Schema.Types
export interface IRefreshToken {
  userId: string
}

export interface IUserPersonalization {
  theme: string
}
export interface IUser {
  _id?: typeof ObjectId | null
  fullName: string
  account: string
  pwd: string
  role: Array<'documenter' | 'techlead' | 'developer'>
  nickName?: string
  personalization?: IUserPersonalization
  refreshToken?: string[]
}
