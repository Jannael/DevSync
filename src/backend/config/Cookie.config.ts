export const config = {
	httpOnly: true,
	sameSite: 'lax',
	secure: false,
} as const

const cookieTime = {
	'5m': { maxAge: 60 * 5 * 1000, ...config }, // 5 minutes
	'10m': { maxAge: 60 * 10 * 1000, ...config }, // 10 minutes
	'15m': { maxAge: 60 * 15 * 1000, ...config }, // 15 minutes
	'365d': { maxAge: 60 * 60 * 24 * 365 * 1000, ...config }, // 1 year
} as const

const cookieConfig = {
	'5m': cookieTime['5m'],
	'10m': cookieTime['10m'],
	'15m': cookieTime['15m'],
	refreshToken: cookieTime['365d'],
	accessToken: cookieTime['15m'],
} as const

export default cookieConfig
