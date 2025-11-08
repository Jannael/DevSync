import user from './user/schema'
import group from './user/group'
import invitation from './user/invitation'

const validator = {
  user: {
    create: user.create,
    partial: user.partial,
    group,
    invitation
  }
}

export default validator
