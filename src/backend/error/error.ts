function createError<T extends string> (name: string): any {
  return class extends Error {
    description?: string
    link?: string[]

    constructor (message: T, description?: string, link?: string[]) {
      super(message)
      this.name = name
      this.description = description
      this.link = link
    }
  }
}
type IDatabaseError = 'Connection error' | 'Failed to save'
export const DatabaseError = createError<IDatabaseError>('databaseError')

export const UserBadRequest = createError('userBadRequest')
export const DuplicateData = createError('duplicateData')
export const NotFound = createError('NotFound')
export const ServerError = createError('ServerError')
