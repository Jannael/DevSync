import z from 'zod'
import { Types } from 'mongoose'
import { ISolution } from '../../interface/solution'
import { UserBadRequest } from '../../error/error'

const schema = z.object({
  _id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'The _id string is invalid.'
  }),
  groupId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'The groupId string is invalid.'
  }),
  feature: z.array(z.string('feature must be valid'))
    .refine(
      (arr) => new Set(arr).size === arr.length,
      { message: 'The user array must contain only unique elements (no duplicates).' }
    ),
  code: z.object({
    language: z.enum(['js'], {
      message: 'code.language must be one of: js'
    }),
    content: z.string('code.content must be valid')
  }),
  description: z.string('Description must be valid')
})

const createSchema = schema.extend({
  feature: schema.shape.feature.optional(),
  code: schema.shape.feature.optional()
})

const validator = {
  create: function (data: ISolution) {
    try {
      const result = createSchema.parse(data)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  },
  partial: function (data: Partial<ISolution>) {
    try {
      const result = createSchema.partial().parse(data)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
