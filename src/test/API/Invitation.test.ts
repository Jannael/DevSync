import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import Roles from '../../backend/constant/Role.constant'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
import ValidateResponseError from '../utils/ValidateResponseError'

dotenv.config({ quiet: true })

/*
FLOW:
	1. Setup: Registers Owner and Invitee. Owner creates a group.
	2. Create: Owner invites Invitee as 'developer'. Verifies invitation availability for both User and Group.
	3. Update Role: Owner updates the Invitee's role in the invitation to 'techLead'.
	4. Cancel: Owner cancels the invitation. Verifies it's removed.
	5. Accept: Invitee accepts a new invitation. Verifies they become a group member.
	6. Reject: Invitee rejects a new invitation. Verifies the invitation is removed.
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

let app: Express
let agent: ReturnType<typeof request.agent>
let agentB: ReturnType<typeof request.agent>
let groupId: string

const user = {
	pwd: 'Password123!',
	nickName: 'Test User',
	fullName: 'Test User',
	account: 'owner@test.com',
}

const userB = {
	pwd: 'Password123!',
	nickName: 'Test User B',
	fullName: 'Test User B',
	account: 'invitee@test.com',
}

const group = {
	name: 'Invitation Test Group',
	color: '#FF5733',
	repository: 'https://github.com/test/invitation-repo',
}

const registerUser = async (
	agent: ReturnType<typeof request.agent>,
	user: {
		pwd: string
		nickName: string
		fullName: string
		account: string
	},
) => {
	await agent.post('/auth/v1/request/code/').send({ account: user.account })
	await agent.post('/auth/v1/verify/code/').send({ code: '1234' })
	await agent.post('/user/v1/create/').send({
		data: user,
	})
}

beforeAll(async () => {
	app = await CreateApp({ DbUrl: env.DB_URL_ENV_TEST, environment: 'test' })
	agent = request.agent(app)
	agentB = request.agent(app)

	await registerUser(agent, user)
	await registerUser(agentB, userB)

	// Create group
	const res = await agent.post('/group/v1/create/').send({ data: group })
	groupId = res.body.data._id
})

afterAll(async () => {
	await CleanDatabase()
	await mongoose.connection.close()
})

describe('/invitation/v1/', () => {
	const api = '/invitation/v1'

	describe('/create/', () => {
		const endpoint = `${api}/create/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({
				groupId,
				data: {
					account: userB.account,
					role: Roles.developer,
				},
			})

			expect(res.body).toStrictEqual({
				success: true,
				data: {
					groupId,
					role: Roles.developer,
					account: userB.account,
				},
				link: [
					{ rel: 'self', href: '/invitation/v1/create/' },
					{ rel: 'invitations', href: '/group/v1/get/invitation/' },
					{ rel: 'group', href: '/group/v1/get/' },
				],
			})

			// Verify invitation exists for user
			const userInvRes = await agentB.get('/user/v1/get/invitation/')
			expect(userInvRes.body).toStrictEqual({
				success: true,
				data: [
					{
						groupId,
						account: userB.account,
						role: Roles.developer,
					},
				],
				link: [
					{ rel: 'self', href: '/user/v1/get/invitation/' },
					{ rel: 'details', href: '/invitation/v1/get/' },
					{ rel: 'accept', href: '/invitation/v1/accept/' },
					{ rel: 'reject', href: '/invitation/v1/reject/' },
				],
			})

			// Verify invitation exists for group
			const groupInvRes = await agent
				.post('/group/v1/get/invitation/')
				.send({ groupId })
			expect(groupInvRes.body).toStrictEqual({
				success: true,
				data: [
					{
						groupId,
						account: userB.account,
						role: Roles.developer,
					},
				],
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
					name: 'Duplicate invitation',
					fn: async () => {
						return await agent.post(endpoint).send({
							groupId,
							data: {
								role: Roles.developer,
								account: userB.account,
							},
						})
					},
					error: {
						code: 409,
						success: false,
						msg: 'Invitation already exists',
						description: undefined,
					},
				},
				{
					name: 'Unauthorized (agentB trying to invite)',
					fn: async () => {
						return await agentB.post(endpoint).send({
							groupId,
							data: {
								account: 'another@test.com',
								role: Roles.developer,
							},
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
					{ rel: 'self', href: '/invitation/v1/create/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/role/', () => {
		const endpoint = `${api}/update/role/`
		test('good request', async () => {
			const res = await agent.patch(endpoint).send({
				groupId,
				newRole: Roles.techLead,
				account: userB.account,
			})

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/invitation/v1/update/role/' },
					{ rel: 'group', href: '/group/v1/get/' },
				],
			})

			const guard = await agent.post('/group/v1/get/invitation/').send({
				groupId,
			})
			expect(guard.body).toStrictEqual({
				success: true,
				data: [
					{
						groupId,
						account: userB.account,
						role: Roles.techLead,
					},
				],
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
					name: 'Unauthorized (agentB trying to update)',
					fn: async () => {
						return await agentB.patch(endpoint).send({
							groupId,
							newRole: Roles.techLead,
							account: user.account,
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
					{ rel: 'self', href: '/invitation/v1/update/role/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/cancel/', () => {
		const endpoint = `${api}/cancel/`
		test('good request', async () => {
			const res = await agent
				.post(endpoint)
				.send({ groupId, account: userB.account })

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/invitation/v1/cancel/' },
					{ rel: 'details', href: '/group/v1/get/' },
				],
			})

			// Verify removal
			const groupInvRes = await agent
				.post('/group/v1/get/invitation/')
				.send({ groupId })
			expect(groupInvRes.body.data).toStrictEqual([])
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Invitation not found',
					fn: async () => {
						return await agent.post(endpoint).send({
							groupId,
						})
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
				link: [
					{ rel: 'self', href: '/invitation/v1/cancel/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/accept/', () => {
		const endpoint = `${api}/accept/`
		test('good request', async () => {
			await agent.post(`${api}/create/`).send({
				groupId,
				data: {
					account: userB.account,
					role: Roles.developer,
				},
			})

			const res = await agentB.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/invitation/v1/accept/' },
					{ rel: 'details', href: '/group/v1/get/' },
				],
			})

			const groupInvRes = await agent
				.post('/group/v1/get/invitation/')
				.send({ groupId })
			expect(groupInvRes.body.data).toStrictEqual([])

			const groupRes = await agentB.post('/group/v1/get/').send({ groupId })
			expect(groupRes.body.data).toStrictEqual({
				_id: groupId,
				name: group.name,
				repository: group.repository,
				color: group.color,
			})

			// Cleanup: agentB quits group
			await agentB.post('/group/v1/quit/').send({ groupId })
		})
	})

	describe('/reject/', () => {
		const endpoint = `${api}/reject/`
		test('good request', async () => {
			// Re-invite first
			await agent.post(`${api}/create/`).send({
				groupId,
				data: {
					account: userB.account,
					role: Roles.developer,
				},
			})

			const res = await agentB.post(endpoint).send({ groupId })

			expect(res.body).toStrictEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/invitation/v1/reject/' },
					{ rel: 'details', href: '/user/v1/get/' },
					{ rel: 'invitations', href: '/user/v1/get/invitation/' },
				],
			})

			// Verify removal
			const groupInvRes = await agent
				.post('/group/v1/get/invitation/')
				.send({ groupId })
			expect(groupInvRes.body.data).toStrictEqual([])

			const userInvRes = await agentB.get('/user/v1/get/invitation/')
			expect(userInvRes.body.data).not.toContainEqual(
				expect.objectContaining({ groupId }),
			)
		})
	})
})
