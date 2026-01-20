import z from 'zod'
import { Types } from 'mongoose'
import { ISolution } from '../../interface/solution'
import { UserBadRequest } from '../../error/error'
import { codeSchema } from '../task/schema'

const schema = z.object({
  _id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'The _id string is invalid.'
  }),
  groupId: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'The groupId string is invalid.'
  }),
  feature: z.array(z.string('feature must be valid').min(3, { message: 'feature must be at least 3 characters long' }).max(255, { message: 'feature must be at most 255 characters long' }))
    .refine(
      (arr) => new Set(arr).size === arr.length,
      { message: 'The user array must contain only unique elements (no duplicates).' }
    ),
  code: codeSchema,
  description: z.string('Description must be valid').min(3, { message: 'Description must be at least 3 characters long' }).max(500, { message: 'Description must be at most 500 characters long' })
})

const createSchema = schema.extend({
  feature: schema.shape.feature.optional(),
  code: schema.shape.feature.optional()
})

const partialSchema = schema.pick({
  code: true,
  description: true,
  feature: true
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
  partial: function (data: Partial<Pick<ISolution, 'code' | 'description' | 'feature'>>) {
    try {
      const result = partialSchema.partial().parse(data)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
