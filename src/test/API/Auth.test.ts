import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import CookiesKeys from '../../backend/constant/Cookie.constant'
import type { IEnv } from '../../backend/interface/Env'
import UserModel from '../../backend/model/User.model'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
import ValidateCookie from '../utils/ValidateCookie'
import ValidateResponseError from '../utils/ValidateResponseError'

dotenv.config({ quiet: true })
jest.mock('../../backend/utils/auth/GenerateCode.utils', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue('1234'),
}))
jest.mock('../../backend/service/SendEmail.service', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(true),
}))

const env = process.env as unknown as IEnv

let testAccount = 'test@gmail.com'
const userPassword = 'Password123!'
const invalidAccount = 'test'
const userNickName = 'Test User'
const userFullName = 'Test User'

let app: Express
let agent: ReturnType<typeof request.agent>

beforeAll(async () => {
	app = await CreateApp({ DbUrl: env.DB_URL_ENV_TEST, environment: 'test' })
	agent = request.agent(app)
	await UserModel.Create({
		data: {
			account: testAccount,
			pwd: userPassword,
			fullName: userFullName,
			nickName: userNickName,
		},
	})
})

afterAll(async () => {
	await CleanDatabase()
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
		const endpoint = `${api}/verify/code/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({ code: '1234' })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.account],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/verify/code/' },
					{ rel: 'create', href: '/user/v1/create/' },
					{ rel: 'update', href: '/user/v1/update/' },
					{ rel: 'delete', href: '/user/v1/delete/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing code',
					fn: async () => {
						return await request(app).post(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing code',
					},
				},
				{
					name: 'Wrong code',
					fn: async () => {
						await agent
							.post(`${api}/request/code/`)
							.send({ account: testAccount })
						return await agent.post(endpoint).send({ code: 'wrong' })
					},
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Wrong code',
					},
				},
				{
					name: 'Missing cookie',
					fn: async () => {
						return await request(app).post(endpoint).send({ code: '1234' })
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: `Missing token = ${CookiesKeys.code}`,
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/auth/v1/verify/code/' },
					{ rel: 'requestCode', href: '/auth/v1/request/code/' },
				],
			})
		})
	})

	describe('/request/refreshToken/code/', () => {
		const endpoint = `${api}/request/refreshToken/code/`
		test('good request', async () => {
			const res = await agent
				.post(endpoint)
				.send({ account: testAccount, pwd: 'Password123!' })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [
					CookiesKeys.genericToken,
					CookiesKeys.refreshTokenRequestCode,
				],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/request/refreshToken/code/' },
					{ rel: 'token', href: '/auth/v1/request/refreshToken/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing account or password',
					fn: async () => {
						return await request(app).post(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing account or password',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [{ rel: 'self', href: '/auth/v1/request/refreshToken/code/' }],
			})
		})
	})

	describe('/request/refreshToken/', () => {
		const endpoint = `${api}/request/refreshToken/`
		test('good request', async () => {
			// Initial setup: get the codes
			await agent
				.post(`${api}/request/refreshToken/code/`)
				.send({ account: testAccount, pwd: 'Password123!' })

			const res = await agent.post(endpoint).send({ code: '1234' })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.refreshToken, CookiesKeys.accessToken],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/request/refreshToken/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing code',
					fn: async () => {
						return await request(app).post(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing code',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [{ rel: 'self', href: '/auth/v1/request/refreshToken/' }],
			})
		})
	})

	describe('/request/accessToken/', () => {
		const endpoint = `${api}/request/accessToken/`
		test('good request', async () => {
			const res = await agent.get(endpoint)

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.accessToken],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/request/accessToken/' },
					{ rel: 'user', href: '/user/v1/get/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing refreshToken',
					fn: async () => {
						return await request(app).get(endpoint)
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing refreshToken',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/account/request/code/', () => {
		const endpoint = `${api}/account/request/code/`
		test('good request', async () => {
			// Need accessToken
			testAccount = 'newTest@gmail.com'
			const res = await agent.patch(endpoint).send({ newAccount: testAccount })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.codeCurrentAccount, CookiesKeys.codeNewAccount],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/account/request/code/' },
					{ rel: 'change', href: '/auth/v1/change/account/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing new account',
					fn: async () => {
						return await request(app).patch(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing new account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [{ rel: 'self', href: '/auth/v1/account/request/code/' }],
			})
		})
	})

	describe('/change/account/', () => {
		const endpoint = `${api}/change/account/`
		test('good request', async () => {
			// Setup
			const res = await agent.patch(endpoint).send({
				codeCurrentAccount: '1234',
				codeNewAccount: '1234',
			})

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.refreshToken, CookiesKeys.accessToken],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/change/account/' },
					{ rel: 'user', href: '/user/v1/get/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing codes',
					fn: async () => {
						await agent
							.patch(`${api}/account/request/code/`)
							.send({ newAccount: 'newtest@gmail.com' })

						return await agent.patch(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing code new account or code current account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/auth/v1/change/account/' },
					{ rel: 'requestCode', href: '/auth/v1/account/request/code/' },
				],
			})
		})
	})

	describe('/password/request/code/', () => {
		const endpoint = `${api}/password/request/code/`
		test('good request', async () => {
			const res = await agent.patch(endpoint).send({ account: testAccount })

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.pwdChange],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/password/request/code/' },
					{ rel: 'change', href: '/auth/v1/change/password/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing account',
					fn: async () => {
						return await request(app).patch(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [{ rel: 'self', href: '/auth/v1/password/request/code/' }],
			})
		})
	})

	describe('/change/password/', () => {
		const endpoint = `${api}/change/password/`
		test('good request', async () => {
			const res = await agent.patch(endpoint).send({
				code: '1234',
				newPwd: 'NewPassword123!',
			})

			ValidateCookie({
				cookieObj: res.header,
				cookies: [CookiesKeys.refreshToken, CookiesKeys.accessToken],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/change/password/' },
					{ rel: 'logout', href: '/auth/v1/request/logout/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing data',
					fn: async () => {
						return await request(app).patch(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing code or new password',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/auth/v1/change/password/' },
					{ rel: 'requestCode', href: '/auth/v1/password/request/code/' },
				],
			})
		})
	})

	describe('/request/logout/', () => {
		const endpoint = `${api}/request/logout/`
		test('good request', async () => {
			const res = await agent.post(endpoint)

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/auth/v1/request/logout/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing refreshToken',
					fn: async () => {
						return await request(app).post(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: `Missing token = ${CookiesKeys.refreshToken}`,
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/auth/v1/request/logout/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})
})
