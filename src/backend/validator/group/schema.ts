import z from 'zod'
import { IGroup } from '../../interface/group'
import { UserBadRequest } from '../../error/error'

const schema = z.object({
  techLead: z.array(z.object({
    fullName: z.string('techLead fullName is required').min(3).max(100),
    account: z.string('techLead account is required').email()
  })).optional(),
  name: z.string('name is required').min(3).max(255),
  repository: z.string().url().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'color must be a valid hex code').optional(),
  member: z.array(z.object({
    _id: z.string('member._id is required'),
    fullName: z.string('member.fullName is required').min(3).max(255),
    role: z.enum(['techLead', 'developer', 'documenter'], {
      message: 'member.role is required and must be one of: admin, editor, viewer'
    })
  })).optional()
})

const validator = {
  create: function (obj: IGroup) {
    try {
      const result = schema.parse(obj)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  },
  partial: function (obj: Partial<IGroup>) {
    try {
      const result = schema.partial().parse(obj)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
