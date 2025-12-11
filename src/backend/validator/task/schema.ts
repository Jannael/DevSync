import z from 'zod'
import { ITask } from '../../interface/task'
import { UserBadRequest } from '../../error/error'

const codeSchema = z.object({
  language: z.enum(['js'], {
    message: 'code.language must be one of: js'
  }),
  content: z.string('code.content must be str')
})

const schema = z.object({
  groupId: z.string('groupId must be a string'),
  user: z.array(z.string('user array must be account[]').email()),
  name: z.string('name must be a string'),
  code: codeSchema,
  feature: z.array(z.string('feature array must be string[]')),
  description: z.string('description must be a string'),
  isComplete: z.boolean('isComplete must be bool'),
  priority: z.number('Priority must be a number between 0-10').min(0).max(10)
})

const validator = {
  create: async function (task: ITask) {
    try {
      const result = schema.parse(task)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  },
  partial: async function (task: ITask) {
    try {
      const result = schema.partial().parse(task)
      return result
    } catch (e) {
      throw new UserBadRequest('Invalid credentials', JSON.parse((e as Error).message)[0].message)
    }
  }
}

export default validator
