export default {
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
}
