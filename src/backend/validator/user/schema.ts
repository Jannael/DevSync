import z from 'zod'
import { IUser } from '../../interface/user'

const create = z.object({
  fullName: z.string(),
  account: z.string().email(),
  pwd: z.string().min(6).max(255),
  role: z.array(z.enum(['documenter', 'techlead', 'developer'] as const)),
  nickName: z.string().min(3).max(255).optional(),
  personalization: z.object({ theme: z.string() }).optional()
})

const validator = {
  create: function (obj: IUser) {
    try {
      const result = create.parse(obj)
      return result
    } catch {
      return null
    }
  }
}

export default validator
