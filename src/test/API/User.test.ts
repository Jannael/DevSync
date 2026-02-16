import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import CookiesKeys from '../../backend/constant/Cookie.constant'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
import ValidateCookie from '../utils/ValidateCookie'
import ValidateCookieRemove from '../utils/ValidateCookieRemove'
import ValidateResponseError from '../utils/ValidateResponseError'

/*
FLOW:
	1. Auth: Initial authentication using 'user.account' to prepare for registration.
	2. Create: Registers the user in the system using the initial 'user' global object.
	3. Get: Verifies that the registered data matches 'user' properties.
	4. Update: 
		- Modifies the 'user' object properties ('nickName', 'fullName') locally.
		- Re-authenticates to perform the update.
		- Sends update request and verifies server response.
		- Uses a guard (/get/) to ensure the server state matches the modified 'user' object 
		  and that restricted fields (like 'account') were not changed.
	5. Delete: Final cleanup by removing the created user.
*/

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

let app: Express
let agent: ReturnType<typeof request.agent>

const user = {
	account: 'test@gmail.com',
	pwd: 'Password123!',
	nickName: 'Test User',
	fullName: 'Test User',
}

async function Auth() {
	await agent.post('/auth/v1/request/code').send({ account: user.account })
	await agent
		.post('/auth/v1/verify/code')
		.send({ account: user.account, code: '1234' })
}

beforeAll(async () => {
	app = await CreateApp({ DbUrl: env.DB_URL_ENV_TEST, environment: 'test' })
	agent = request.agent(app)
})
afterAll(async () => {
	await CleanDatabase()
	await mongoose.connection.close()
})

describe('/user/v1/', () => {
	const api = '/user/v1'

	describe('/create/', () => {
		const endpoint = `${api}/create/`

		test('good request', async () => {
			await Auth()
			const res = await agent.post(endpoint).send({
				data: user,
			})

			ValidateCookie({
				cookieObj: res.headers,
				cookies: [CookiesKeys.refreshToken, CookiesKeys.accessToken],
			})

			ValidateCookieRemove({
				cookieObj: res.headers,
				cookies: [CookiesKeys.account],
			})

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					fullName: 'Test User',
					account: 'test@gmail.com',
					nickName: 'Test User',
				},
				link: [
					{ rel: 'self', href: '/user/v1/create/' },
					{ rel: 'details', href: '/user/v1/get/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing user data',
					fn: async () => {
						await Auth()
						return await agent.post(endpoint)
					},
					error: {
						success: false,
						code: 400,
						msg: 'Missing data',
						description: 'Missing user data',
					},
				},
				{
					name: 'Auth token is missing',
					fn: () => request(app).post(endpoint),
					error: {
						success: false,
						code: 400,
						msg: 'Missing data',
						description: 'Missing token = account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/create/' },
					{ rel: 'verify', href: '/auth/v1/verify/code/' },
					{ rel: 'requestCode', href: '/auth/v1/request/code/' },
				],
			})
		})
	})

	describe('/get/', () => {
		const endpoint = `${api}/get/`

		test('good request', async () => {
			const res = await agent.get(endpoint)

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					fullName: user.fullName,
					account: user.account,
					nickName: user.nickName,
				},
				link: [
					{ rel: 'self', href: '/user/v1/get/' },
					{ rel: 'groups', href: '/user/v1/get/group/' },
					{ rel: 'invitations', href: '/user/v1/get/invitation/' },
					{ rel: 'update', href: '/user/v1/update/' },
					{ rel: 'delete', href: '/user/v1/delete/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Auth token is missing',
					fn: () => request(app).get(endpoint),
					error: {
						success: false,
						code: 401,
						msg: 'Access token is invalid',
						description: 'Missing token = accessToken',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/get/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/get/group/', () => {
		const endpoint = `${api}/get/group/`

		test('good request', async () => {
			const res = await agent.get(endpoint)

			expect(res.body).toStrictEqual({
				success: true,
				data: [],
				link: [
					{ rel: 'self', href: '/user/v1/get/group/' },
					{ rel: 'details', href: '/group/v1/get/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Auth token is missing',
					fn: () => request(app).get(endpoint),
					error: {
						success: false,
						code: 401,
						msg: 'Access token is invalid',
						description: 'Missing token = accessToken',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/get/group/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/get/invitation/', () => {
		const endpoint = `${api}/get/invitation/`

		test('good request', async () => {
			const res = await agent.get(endpoint)

			expect(res.body).toStrictEqual({
				success: true,
				data: [],
				link: [
					{ rel: 'self', href: '/user/v1/get/invitation/' },
					{ rel: 'details', href: '/invitation/v1/get/' },
					{ rel: 'accept', href: '/invitation/v1/accept/' },
					{ rel: 'reject', href: '/invitation/v1/reject/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Auth token is missing',
					fn: () => request(app).get(endpoint),
					error: {
						success: false,
						code: 401,
						msg: 'Access token is invalid',
						description: 'Missing token = accessToken',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/get/invitation/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/', () => {
		const endpoint = `${api}/update/`

		test('good request', async () => {
			user.nickName = 'new nickName User'
			user.fullName = 'new fullName User'

			await Auth()
			const res = await agent.put(endpoint).send({
				data: {
					nickName: user.nickName,
					fullName: user.fullName,
					account: 'newaccount@gmail.com', // i leave this here because account should not be possible to update here, so if it changes i want to know
				},
			})

			ValidateCookie({
				cookieObj: res.headers,
				cookies: [CookiesKeys.accessToken, CookiesKeys.refreshToken],
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/user/v1/update/' },
					{ rel: 'details', href: '/user/v1/get/' },
					{ rel: 'delete', href: '/user/v1/delete/' },
				],
			})

			ValidateCookieRemove({
				cookieObj: res.headers,
				cookies: [CookiesKeys.account],
			})

			const guard = await agent.get(`${api}/get/`)

			expect(guard.body).toStrictEqual({
				success: true,
				data: {
					nickName: user.nickName,
					fullName: user.fullName,
					account: user.account,
				},
				link: [
					{ rel: 'self', href: '/user/v1/get/' },
					{ rel: 'groups', href: '/user/v1/get/group/' },
					{ rel: 'invitations', href: '/user/v1/get/invitation/' },
					{ rel: 'update', href: '/user/v1/update/' },
					{ rel: 'delete', href: '/user/v1/delete/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing user data',
					fn: async () => {
						await Auth()
						return await agent.put(endpoint)
					},
					error: {
						success: false,
						code: 400,
						msg: 'Missing data',
						description: 'Missing user data',
					},
				},
				{
					name: 'Auth token is missing',
					fn: () => request(app).put(endpoint),
					error: {
						success: false,
						code: 400,
						msg: 'Missing data',
						description: 'Missing token = account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/update/' },
					{ rel: 'verify', href: '/auth/v1/verify/code/' },
					{ rel: 'requestCode', href: '/auth/v1/request/code/' },
				],
			})
		})
	})

	describe('/delete/', () => {
		const endpoint = `${api}/delete/`

		test('good request', async () => {
			await Auth()
			const res = await agent.delete(endpoint)

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/user/v1/delete/' },
					{ rel: 'create', href: '/user/v1/create/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Auth token is missing',
					fn: () => request(app).delete(endpoint),
					error: {
						success: false,
						code: 400,
						msg: 'Missing data',
						description: 'Missing token = account',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/user/v1/delete/' },
					{ rel: 'verify', href: '/auth/v1/verify/code/' },
					{ rel: 'requestCode', href: '/auth/v1/request/code/' },
				],
			})
		})
	})
})
