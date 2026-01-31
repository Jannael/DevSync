import group from './group/schema'
import solution from './solution/schema'
import task from './task/schema'
import user_group from './user/group'
import user_invitation from './user/invitation'
import user from './user/schema'

const validator = {
	user: {
		create: user.create,
		partial: user.partial,
		group: user_group,
		invitation: user_invitation,
	},
	group: {
		create: group.create,
		partial: group.partial,
		member: group.member,
		role: group.role,
	},
	task: {
		create: task.create,
		partial: task.partial,
	},
	solution: {
		create: solution.create,
		partial: solution.partial,
	},
}

export default validator
