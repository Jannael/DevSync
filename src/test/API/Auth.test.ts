import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import ValidateCookie from '../utils/ValidateCookie'
import ValidateResponseError from '../utils/ValidateResponseError'
import CookiesKeys from '../../backend/constant/Cookie.constant'

dotenv.config({ quiet: true })

const env = process.env as unknown as IEnv

const testAccount = 'test@gmail.com'
const invalidAccount = 'test'

let app: Express
let agent: ReturnType<typeof request.agent>

jest.mock('../../backend/utils/auth/GenerateCode.utils', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue('1234'),
}))

jest.mock('../../backend/service/SendEmail.service', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(true),
}))

beforeAll(async () => {
	app = await CreateApp({ DbUrl: env.DB_URL_ENV_TEST, environment: 'test' })
	agent = await request.agent(app)
})

afterAll(async () => {
	await mongoose.connection.close()
})

describe('/auth/v1/', () => {
	const api = '/auth/v1'

	describe('/request/code/', () => {
		const endpoint = `${api}/request/code/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({ account: testAccount })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.code],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/request/code/' },
					{ rel: 'verify', href: '/auth/v1/verify/code/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Invalid account',
					fn: async () => {
						return await request(app)
							.post(endpoint)
							.send({ account: invalidAccount })
					},
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [{ rel: 'self', href: '/auth/v1/request/code/' }],
			})
		})
	})
	describe('/verify/code/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/request/accessToken/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/request/refreshToken/code/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/request/refreshToken/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/account/request/code/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/change/account/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/password/request/code/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/change/password/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
	describe('/request/logout/', () => {
		test.todo('good request')
		describe('error request', () => {
			for (let i = 0; i < 10; i++) {
				test.todo('Forbidden: Missing required header')
			}
		})
	})
})
