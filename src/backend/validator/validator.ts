import userSchema from './user/schema'
import { IUser } from '../interface/user'

const validator = {
  user: {
    create: function (obj: IUser): IUser | null {
      try {
        const result = userSchema.create.parse(obj)
        return result
      } catch {
        return null
      }
    }
  }
}

export default validator
