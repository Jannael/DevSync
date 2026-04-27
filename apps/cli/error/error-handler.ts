import { NotFound, ServerError, Forbidden, Conflict, BadRequest } from '@/error/error-instance'
import { X } from '@/utils/icons-terminal'

const errors = [NotFound, ServerError, Forbidden, Conflict, BadRequest]

/*
  error handler is only use in app/ in mixins, functions, etc, just throw an error 
*/

export function errorHandler(error: unknown) {
  for (const e of errors) {
    if (error instanceof e) {
      console.error(X(error.message))
      if (error.description) {
        console.error(`  ${error.description}`)
      }
      process.exit(1)
    }
  }

  console.error(X('An unexpected error occurred'))
  if (error instanceof Error) {
    console.error(`  ${error.message}`)
  }
}
