export default {
	cookies: {
		code: {
			httpOnly: true,
			maxAge: 60 * 5 * 1000,
			sameSite: 'lax',
			secure: false,
		},
		codeNewAccount: {
			httpOnly: true,
			maxAge: 60 * 10 * 1000,
			sameSite: 'lax',
			secure: false,
		},
		accessToken: {
			httpOnly: true,
			maxAge: 60 * 15 * 1000,
			sameSite: 'lax',
			secure: false,
		},
		refreshToken: {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 365 * 1000,
			sameSite: 'lax',
			secure: false,
		},
	},
	jwt: {
		code: { expiresIn: '5m' },
		accessToken: { expiresIn: '15m' },
		refreshToken: { expiresIn: '365d' },
		codeNewAccount: { expiresIn: '10m' },
	},
	database: {
		mongodb: {
			schemaOptions: {
				versionKey: false as const,
				strict: true,
				minimize: false,
			},
		},
		projection: {
			IRefreshToken: { pwd: 0, refreshToken: 0, invitation: 0, group: 0 },
			ITaskListItem: {
				_id: 1,
				name: 1,
				priority: 1,
				isComplete: 1,
				user: 1,
			},
		},
		taskPagination: 10,
	},
	user: {
		maxInvitations: 5,
		maxGroups: 5,
		defaultRole: 'developer',
		maxSessions: 3,
	},
	group: {
		maxMembers: 5,
	},
} as const
