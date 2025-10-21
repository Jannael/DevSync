function createError (name: string): any {
  return class extends Error {
    description?: string

    constructor (message: string, description?: string) {
      super(message)
      this.name = name
      this.description = description
    }
  }
}

export const DatabaseError = createError('databaseError')
export const UserBadRequest = createError('userBadRequest')
export const DuplicateData = createError('duplicateData')
export const NotFound = createError('NotFound')
export const ServerError = createError('ServerError')
