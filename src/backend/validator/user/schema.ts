import z from 'zod'
import { IUser } from '../../interface/user'
import { UserBadRequest } from '../../error/error'

const create = z.object({
  fullName: z.string(),
  account: z.string().email(),
  pwd: z.string().min(6).max(255),
  role: z.array(z.enum(['documenter', 'techLead', 'developer'] as const)),
  nickName: z.string().min(3).max(255).optional(),
  personalization: z.object({ theme: z.string() }).optional()
})

const validator = {
  create: function (obj: IUser) {
    try {
      const result = create.parse(obj)
      return result
    } catch {
      throw new UserBadRequest('Invalid or missing data, the user must match the following rules, pwd-length>=6, account(unique cant be two users with the same account): example@service.com, nickName-length>=3, personalization: {theme: \'\'}, role: ["documenter" or "techLead" or "developer"]')
    }
  },
  partial: function (obj: IUser) {
    try {
      const result = create.partial().parse(obj)
      return result
    } catch {
      return null
    }
  }
}

export default validator
