import { Types } from 'mongoose'

export interface IUserPersonalization {
  theme?: string | null
}
export interface IUser {
  _id?: Types.ObjectId
  fullName: string
  account: string
  pwd: string
  role: string[]
  nickName?: string | null
  personalization?: IUserPersonalization | null
  refreshToken?: string[] | null
}
export interface IRefreshToken {
  _id?: Types.ObjectId
  fullName: string
  account: string
  role: string[]
  nickName?: string | null
  personalization?: IUserPersonalization | null
}
