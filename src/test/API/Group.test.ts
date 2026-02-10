import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import { DefaultRole } from '../../backend/constant/Role.constant'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
import ValidateResponseError from '../utils/ValidateResponseError'

dotenv.config({ quiet: true })

/*
FLOW:
	1. Setup: Registers a User (Owner).
	2. Create: Owner creates a new group.
	3. Get: Retrieves group details to verify persistence.
	4. Get Invitation: Lists invitations (initially empty).
	5. Update: Owner modifies group details (Name, Color).
	6. Join: A second user joins the group via code/link (simulated).
	7. Quit: The second user leaves the group.
	8. Delete: Owner deletes the group.
*/

jest.mock('../../backend/utils/auth/GenerateCode.utils', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue('1234'),
}))
jest.mock('../../backend/service/SendEmail.service', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(true),
}))

const env = process.env as unknown as IEnv

const userAccount = 'test_group_owner@gmail.com'
const userPassword = 'Password123!'
const userNickName = 'GroupOwner'
const userFullName = 'Group Owner'

const secondUserAccount = 'test_group_member@gmail.com'
const secondUserNickName = 'GroupMember'
const secondUserFullName = 'Group Member'

let app: Express
let agent: ReturnType<typeof request.agent>
let agentB: ReturnType<typeof request.agent>
let groupId: string
const group = {
	name: 'Test Group',
	color: '#000000',
	repository: 'https://github.com/test/repo',
}

const registerUser = async (
	agent: ReturnType<typeof request.agent>,
	account: string,
	nickName: string,
	fullName: string,
) => {
	await agent.post('/auth/v1/request/code/').send({ account })
	await agent.post('/auth/v1/verify/code/').send({ code: '1234' })
	await agent.post('/user/v1/create/').send({
		data: {
			pwd: userPassword,
			nickName,
			fullName,
		},
	})
}

beforeAll(async () => {
	app = await CreateApp({ DbUrl: env.DB_URL_ENV_TEST, environment: 'test' })
	agent = request.agent(app)
	agentB = request.agent(app)
	await registerUser(agent, userAccount, userNickName, userFullName)
})

afterAll(async () => {
	await CleanDatabase()
	await mongoose.connection.close()
})

describe('/group/v1/', () => {
	const api = '/group/v1'

	describe('/create/', () => {
		const endpoint = `${api}/create/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({
				data: group,
			})

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					name: 'Test Group',
					repository: 'https://github.com/test/repo',
					color: '#000000',
					_id: expect.any(String),
				},
				link: [
					{ rel: 'self', href: '/group/v1/create/' },
					{ rel: 'get', href: '/group/v1/get/' },
					{ rel: 'update', href: '/group/v1/update/' },
					{ rel: 'delete', href: '/group/v1/delete/' },
				],
			})

			groupId = res.body.data._id
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing data',
					fn: async () => {
						return await agent.post(endpoint).send({})
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing group data',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/create/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/get/', () => {
		const endpoint = `${api}/get/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					_id: groupId,
					name: group.name,
					color: group.color,
					repository: group.repository,
				},
				link: [
					{ rel: 'self', href: '/group/v1/get/' },
					{ rel: 'members', href: '/member/v1/get/' },
					{ rel: 'invitations', href: '/group/v1/get/invitation/' },
					{ rel: 'tasks', href: '/task/v1/list/' },
					{ rel: 'createTask', href: '/task/v1/create/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing group id',
					fn: async () => {
						const res = await agent.post(endpoint).send({})
						return res
					},
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing group id',
					},
				},
				{
					name: 'Invalid group id',
					fn: async () => {
						return await agent.post(endpoint).send({ groupId: 'invalid' })
					},
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid group id',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/get/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/get/invitation/', () => {
		const endpoint = `${api}/get/invitation/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				data: [],
				link: [
					{ rel: 'self', href: '/group/v1/get/invitation/' },
					{ rel: 'details', href: '/group/v1/get/' },
					{ rel: 'cancel', href: '/invitation/v1/cancel/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Unauthorized (not TechLead)',
					fn: async () => {
						await registerUser(
							agentB,
							secondUserAccount,
							secondUserNickName,
							secondUserFullName,
						)
						return await agentB.post(endpoint).send({ groupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/get/invitation/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/', () => {
		const endpoint = `${api}/update/`
		test('good request', async () => {
			group.name = 'Updated Group Name'
			group.color = '#ffffff'
			const res = await agent.put(endpoint).send({
				groupId,
				data: group,
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/group/v1/update/' },
					{ rel: 'get', href: '/group/v1/get/' },
					{ rel: 'delete', href: '/group/v1/delete/' },
				],
			})

			// Verify update
			const guard = await agent.post(`${api}/get/`).send({ groupId })
			expect(guard.body.data.name).toBe(group.name)
			expect(guard.body.data.color).toBe(group.color)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Unauthorized (not TechLead)',
					fn: async () => {
						return await agentB.put(endpoint).send({
							groupId,
							data: { name: 'Hacker Name' },
						})
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/update/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/join/', () => {
		const endpoint = `${api}/join/`
		test('good request', async () => {
			const res = await agentB.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					groupId,
					account: secondUserAccount,
					role: DefaultRole,
				},
				link: [
					{ rel: 'self', href: '/group/v1/join/' },
					{ rel: 'get', href: '/group/v1/get/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Already a member',
					fn: async () => {
						return await agentB.post(endpoint).send({ groupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You are already a member of this group',
					},
				},
				{
					name: 'Group not found',
					fn: async () => {
						return await agentB
							.post(endpoint)
							.send({ groupId: new mongoose.Types.ObjectId().toString() })
					},
					error: {
						code: 404, // Controller throws NotFound
						success: false,
						msg: 'Group not found',
						description: undefined,
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/join/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/quit/', () => {
		const endpoint = `${api}/quit/`
		test('good request', async () => {
			const res = await agentB.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/group/v1/quit/' },
					{ rel: 'join', href: '/group/v1/join/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Not a member (already quit)',
					fn: async () => {
						return await agentB.post(endpoint).send({ groupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/quit/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/delete/', () => {
		const endpoint = `${api}/delete/`
		test('good request', async () => {
			const res = await agent.delete(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/group/v1/delete/' },
					{ rel: 'create', href: '/group/v1/create/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					// Since group is deleted, subsequent delete should fail?
					// Or try to delete with agentB who is not techLead (and group doesn't exist anymore).
					// Let's create a temp group to test unauthorized delete?
					// Or just check that agentB cannot delete.
					// But we need a valid group for RoleMiddleware to pass if we want to hit the controller logic?
					// If group doesn't exist, RoleMiddleware will fail or Controller will fail?
					// Let's assume testing with deleted group returns 404 or 403.
					// But the plan asked for "Verify unprivileged user cannot delete".
					// So I should have done this BEFORE deleting the group in the 'good request'.
					// But the order was Create -> ... -> Delete.
					// So I should create another group for this error case, OR verify "Group not found" now.
					// Reviewing the plan: "error request: Verify unprivileged user cannot delete."
					// I'll adjust the flow slightly: I'll create a TEMPORARY group for the error case test, or just skip it if it's too complex.
					// Better: Test the error case BEFORE the good request in this block?
					// Jest runs tests in order.
					name: 'Unauthorized (not TechLead)',
					fn: async () => {
						// Create a new group with agent just for this test
						const tempRes = await agent.post(`${api}/create/`).send({
							data: group,
						})
						const tempGroupId = tempRes.body.data._id

						// Accessing with agentB (not member)
						const res = await agentB
							.delete(endpoint)
							.send({ groupId: tempGroupId })

						// Cleanup
						await agent.delete(endpoint).send({ groupId: tempGroupId })
						return res
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not belong to the group',
					},
				},
				{
					name: 'Group not found (already deleted)',
					fn: async () => {
						return await agent.delete(endpoint).send({ groupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/group/v1/delete/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})
})
