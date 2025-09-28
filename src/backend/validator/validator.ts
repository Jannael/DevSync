import userValidator from './user/schema'

const validator = {
  user: {
    create: userValidator.create
  }
}

export default validator
