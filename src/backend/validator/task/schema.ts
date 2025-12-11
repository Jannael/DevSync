import z from 'zod'
import { ITask } from '../../interface/task'
import { UserBadRequest } from '../../error/error'
import { Types } from 'mongoose'

const codeSchema = z.object({
  language: z.enum(['js'], {
    message: 'code.language must be one of: js'
  }),
  content: z.string('code.content must be str')
})

const schema = z.object({
  groupId: z.instanceof(Types.ObjectId, {
    message: 'groupId must be valid'
  }),
  user: z.array(z.string('user array must be account[]').email('Invalid account at user array')),
  name: z.string('name must be a string'),
  code: codeSchema,
  feature: z.array(z.string('feature array must be string[]')),
  description: z.string('description must be a string, and must be < 500 length').max(500),
  isComplete: z.boolean('isComplete must be bool').default(false),
  priority: z.number('Priority must be a number between 0-10').min(0).max(10).default(0)
})

const validator = {
  create: function (task: ITask) {
    try {
      const result = schema.parse(task)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  },
  partial: function (task: Partial<ITask>) {
    try {
      const result = schema.partial().parse(task)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
