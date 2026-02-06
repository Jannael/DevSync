import cookieParser from 'cookie-parser'
import cors, { type CorsOptions } from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import HeaderMiddleware from './middleware/Header.middleware'
import router from './route/Merge.route'

dotenv.config({ quiet: true })
const HOST = process.env.HOST as string
const whitelist = HOST.split(',')

const corsOptions: CorsOptions = {
	origin: (origin, cb) => {
		if (origin === undefined || whitelist.includes(origin)) cb(null, true)
		else cb(new Error(`CORS: Origin ${origin} Not allowed`))
	},
	credentials: true,
}

const limiter = rateLimit({
	windowMs: 30 * 1000,
	max: 60,
	message: { success: false, msg: 'Too many request' },
	headers: true,
})

export async function createApp(
	dbEnv: string,
	env: 'production' | 'test',
): Promise<express.Express> {
	await mongoose
		.connect(dbEnv)
		.then(() => console.log('connected to mongoose'))
		.catch((e) =>
			console.error('something went wrong connecting to mongoose', e),
		)

	const app = express()

	if (env === 'production') {
		// because in tests the rate limit is reached so fast
		app.use(limiter)
		app.use(cors(corsOptions))
	}

	app.use(express.json())
	app.use((req, _res, next) => {
		if (!req.body) {
			req.body = {}
		}
		if (!req.cookies) {
			req.cookies = {}
		}
		next()
	})
	app.use(cookieParser())
	app.use(HeaderMiddleware)

	app.use('/auth/v1/', router.auth)
	app.use('/user/v1/', router.user)
	app.use('/utils/v1/', router.utils)
	app.use('/group/v1/', router.group)
	app.use('/task/v1/', router.task)
	app.use('/solution/v1/', router.solution)

	return app
}
