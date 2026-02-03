import Roles from '../constant/Role.constant'
import type { ITask } from '../interface/Task'

const hasTaskAccess = ({
	task,
	userAccount,
	role,
}: {
	task: ITask['user']
	userAccount: string
	role: string
}): boolean => {
	// TechLead always has access
	if (role === Roles.techLead) {
		return true
	}

	// Check if user is assigned to the task
	if (task && Array.isArray(task)) {
		return task.includes(userAccount)
	}

	return false
}

export default hasTaskAccess
