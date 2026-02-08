export default {
	IRefreshToken: {
		_id: 1,
		fullName: 1,
		account: 1,
		nickName: 1,
	},
	ITaskListItem: {
		_id: 1,
		name: 1,
		priority: 1,
		isComplete: 1,
		user: 1,
	},
} as const
