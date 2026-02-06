import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import CorsOptions from './CorsOptions'
import HeaderMiddleware from './middleware/Header.middleware'
import RateLimit from './RateLimit.config'
import RouterMerge from './route/Merge.route'

export const environments = { production: 'production', test: 'test' } as const

export async function CreateApp({
	DbUrl,
	environment,
}: {
	DbUrl: string
	environment: keyof typeof environments
}): Promise<express.Express> {
	await mongoose
		.connect(DbUrl)
		.then(() => console.log('connected to mongoose'))
		.catch((e) =>
			console.error('something went wrong connecting to mongoose', e),
		)
	const app = express()

	if (environment === environments.production) {
		// because in tests the rate limit is reached so fast
		app.use(RateLimit)
		app.use(cors(CorsOptions))
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

	app.use('/auth/v1/', RouterMerge.Auth)
	app.use('/group/v1/', RouterMerge.Group)
	app.use('/invitation/v1/', RouterMerge.Invitation)
	app.use('/member/v1/', RouterMerge.Member)
	app.use('/solution/v1/', RouterMerge.Solution)
	app.use('/task/v1/', RouterMerge.Task)
	app.use('/user/v1/', RouterMerge.User)
	app.use('/utils/v1/', RouterMerge.Utils)

	return app
}
