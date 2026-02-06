import rateLimit from 'express-rate-limit'

const RateLimit = rateLimit({
	windowMs: 30 * 1000,
	max: 60,
	message: { success: false, msg: 'Too many request' },
	headers: true,
})

export default RateLimit
