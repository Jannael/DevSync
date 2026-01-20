import z from 'zod'
import { IUser } from '../../interface/user'
import { UserBadRequest } from '../../error/error'
import passwordSchema from '../pwdSchema'

const create = z.object({
  fullName: z.string('fullName is required').min(3, { message: 'fullName must be at least 3 characters long' }).max(100, { message: 'fullName must be at most 100 characters long' }),
  account: z.string('the Account is required').email(),
  pwd: passwordSchema,
  nickName: z.string().min(3, { message: 'nickName must be at least 3 characters long' }).max(100, { message: 'nickName must be at most 100 characters long' })
})

const validator = {
  create: function (obj: IUser) {
    try {
      const result = create.parse(obj)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  },
  partial: function (obj: Partial<IUser>) {
    try {
      const result = create.partial().parse(obj)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
