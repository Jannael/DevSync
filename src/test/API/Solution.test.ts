import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
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
let agentC: ReturnType<typeof request.agent>
let groupId: string
let taskId: string
const agentCAccount = 'unprivileged@gmail.com'

const group = {
	name: 'Test Group',
	color: '#000000',
	repository: 'https://github.com/test/repo',
}
const task = {
	name: 'Test Task',
	description: 'Test Description',
	user: [secondUserAccount],
	code: {
		language: 'typescript',
		content: 'console.log("Hello World")',
	},
	feature: ['test'],
	priority: 0,
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

	// agents setup
	agent = request.agent(app)
	agentB = request.agent(app)
	agentC = request.agent(app)

	await registerUser(agent, userAccount, userNickName, userFullName)
	await registerUser(
		agentB,
		secondUserAccount,
		secondUserNickName,
		secondUserFullName,
	)
	await registerUser(agentC, agentCAccount, 'Un', 'User')

	const res = await agent.post('/group/v1/create').send({ data: group })
	groupId = res.body.data._id
	await agentB.post('/group/v1/join/').send({ groupId })
	await agentC.post('/group/v1/join/').send({ groupId })
	const taskRes = await agent.post('/task/v1/create/').send({
		data: task,
		groupId,
	})

	taskId = taskRes.body.data._id
})

afterAll(async () => {
	await CleanDatabase()
	await mongoose.connection.close()
})

describe('/solution/v1/', () => {
	const api = '/solution/v1'
	const solutionData = {
		description: 'Test Solution Description',
		feature: ['test-feature'],
		code: {
			language: 'typescript',
			content: 'console.log("Solution Code")',
		},
	}

	describe('/create/', () => {
		const endpoint = `${api}/create/`
		test('good request', async () => {
			const res = await agentB.post(endpoint).send({
				groupId,
				data: {
					...solutionData,
					_id: taskId,
				},
			})

			expect(res.body).toMatchObject({
				success: true,
				data: {
					...solutionData,
					_id: taskId,
					groupId,
					user: secondUserAccount,
				},
			})

			const taskRes = await agentB
				.post('/task/v1/get/')
				.send({ _id: taskId, groupId })

			expect(taskRes.body.data.isComplete).toBe(true)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing solution data',
					fn: () => agentB.post(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing solution data',
					},
				},
				{
					name: 'Task not found',
					fn: () =>
						agentB.post(endpoint).send({
							groupId,
							data: {
								...solutionData,
								_id: new mongoose.Types.ObjectId().toString(),
							},
						}),
					error: {
						code: 404,
						success: false,
						msg: 'Task not found',
						description: 'The task does not exist',
					},
				},
				{
					name: 'Solution already exists',
					fn: () =>
						agentB.post(endpoint).send({
							groupId,
							data: { ...solutionData, _id: taskId },
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'Solution already exists',
					},
				},
				{
					name: 'Unauthorized (not assigned and not TechLead)',
					fn: () =>
						agentC.post(endpoint).send({
							groupId,
							data: { ...solutionData, _id: taskId },
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description:
							'You must be assigned to this task or be a techLead to create a solution',
					},
				},
				{
					name: 'Zod Validation Error (missing description)',
					fn: () =>
						agentB.post(endpoint).send({
							groupId,
							data: { ...solutionData, _id: taskId, description: undefined },
						}),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Description is required',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/solution/v1/create/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/get/', () => {
		const endpoint = `${api}/get/`
		test('good request', async () => {
			const res = await agentB.post(endpoint).send({ _id: taskId, groupId })

			expect(res.body).toMatchObject({
				success: true,
				data: {
					...solutionData,
					user: secondUserAccount,
				},
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing solution id',
					fn: () => agentB.post(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing solution id',
					},
				},
				{
					name: 'Invalid solution id',
					fn: () => agentB.post(endpoint).send({ groupId, _id: 'invalid' }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid solution id',
					},
				},
				{
					name: 'Solution does not belong to the group',
					fn: async () => {
						const res = await agent.post('/group/v1/create').send({
							data: { ...group, name: 'Other Group Sol' },
						})
						const otherGroupId = res.body.data._id
						return await agent
							.post(endpoint)
							.send({ _id: taskId, groupId: otherGroupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'Solution does not belong to the group',
					},
				},
				{
					name: 'Unauthorized (not a member)',
					fn: async () => {
						const agentD = request.agent(app)
						await registerUser(agentD, 'outsider@gmail.com', 'Out', 'Sider')
						return await agentD.post(endpoint).send({ _id: taskId, groupId })
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
					{ rel: 'self', href: '/solution/v1/get/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/', () => {
		const endpoint = `${api}/update/`
		test('good request', async () => {
			solutionData.description = 'Updated Solution Description'

			const res = await agentB.put(endpoint).send({
				_id: taskId,
				groupId,
				data: {
					description: solutionData.description,
				},
			})

			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/solution/v1/update/' },
					{ rel: 'get', href: '/solution/v1/get/' },
					{ rel: 'delete', href: '/solution/v1/delete/' },
				],
			})

			const guard = await agentB
				.post(`${api}/get/`)
				.send({ _id: taskId, groupId })
			expect(guard.body.data.description).toBe(solutionData.description)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing solution id',
					fn: () =>
						agentB
							.put(endpoint)
							.send({ groupId, data: { description: 'New' } }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing solution id',
					},
				},
				{
					name: 'Invalid solution id',
					fn: () =>
						agentB
							.put(endpoint)
							.send({ groupId, _id: 'invalid', data: { description: 'New' } }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid solution id',
					},
				},
				{
					name: 'Missing solution data',
					fn: () => agentB.put(endpoint).send({ groupId, _id: taskId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing solution data',
					},
				},
				{
					name: 'No data to update',
					fn: () =>
						agentB.put(endpoint).send({ groupId, _id: taskId, data: {} }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'No data to update',
					},
				},
				{
					name: 'Unauthorized (not assigned and not TechLead)',
					fn: () =>
						agentC.put(endpoint).send({
							_id: taskId,
							groupId,
							data: { description: 'Attempt' },
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description:
							'You must be assigned to this task or be a techLead to update this solution',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/solution/v1/update/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/delete/', () => {
		const endpoint = `${api}/delete/`
		test('good request', async () => {
			const res = await agentB.delete(endpoint).send({ _id: taskId, groupId })

			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/solution/v1/delete/' },
					{ rel: 'task', href: '/task/v1/get/' },
				],
			})

			const taskRes = await agentB
				.post('/task/v1/get/')
				.send({ _id: taskId, groupId })
			expect(taskRes.body.data.isComplete).toBe(false)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing solution id',
					fn: () => agentB.delete(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing solution id',
					},
				},
				{
					name: 'Solution not found',
					fn: () =>
						agentB.delete(endpoint).send({
							groupId,
							_id: new mongoose.Types.ObjectId().toString(),
						}),
					error: {
						code: 404,
						success: false,
						msg: 'Solution not found',
						description: undefined,
					},
				},
				{
					name: 'Unauthorized (not assigned and not TechLead)',
					fn: async () => {
						const solRes = await agentB.post(`${api}/create/`).send({
							groupId,
							data: {
								...solutionData,
								_id: taskId,
							},
						})

						return await agentC.delete(endpoint).send({
							_id: solRes.body.data._id,
							groupId,
						})
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description:
							'You must be assigned to this task or be a techLead to delete this solution',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/solution/v1/delete/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})
})
