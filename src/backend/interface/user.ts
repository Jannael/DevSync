export interface IrefreshToken {
  userId: string
}

export interface IUserPersonalization {
  theme: string
}
export interface IUser {
  _id?: string
  fullName: string
  account: string
  pwd: string
  role: Array<'documenter' | 'techlead' | 'developer'>
  nickName?: string
  personlization: IUserPersonalization
  refreshToken: string
}
