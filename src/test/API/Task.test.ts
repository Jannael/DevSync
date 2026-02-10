import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import type { IEnv } from '../../backend/interface/Env'
import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'
import CleanDatabase from '../utils/CleanDatabase'
import ValidatePagination from '../utils/ValidatePagination'
import ValidateResponseError from '../utils/ValidateResponseError'

/*
FLOW:
	1. Setup: 
		- Registers Agent A (TechLead) and Agent B (Member).
		- Agent A creates a group and Agent B joins it.
		- Captures 'groupId' in the global scope.
	2. Create: 
		- Agent A creates a task assigned to Agent B using the global 'task' object.
		- Captures 'taskId' for subsequent tests.
	3. Get: Agent B verifies they can retrieve information about their assigned task.
	4. List: Agent B verifies the task appears in their task list.
	5. Update:
		- Agent A modifies global 'task' properties ('name', 'description', 'priority') locally.
		- Sends update request to the server.
		- Uses a guard (Agent B /get/) to verify that changes are reflected for assigned users.
	6. Delete:
		- Agent A deletes the task.
		- Agent B verifies the task is no longer accessible.
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
	await registerUser(agent, userAccount, userNickName, userFullName)
	await registerUser(
		agentB,
		secondUserAccount,
		secondUserNickName,
		secondUserFullName,
	)

	const res = await agent.post('/group/v1/create').send({ data: group })
	groupId = res.body.data._id
	await agentB.post('/group/v1/join/').send({ groupId })
})

afterAll(async () => {
	await CleanDatabase()
	await mongoose.connection.close()
})

describe('/task/v1/', () => {
	const api = '/task/v1'
	let taskId: string

	describe('/create/', () => {
		const endpoint = `${api}/create/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({
				groupId,
				data: task,
			})

			expect(res.body).toMatchObject({
				success: true,
				data: {
					...task,
					groupId,
					_id: expect.any(String),
				},
			})

			taskId = res.body.data._id
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing task data',
					fn: () => agent.post(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing task data',
					},
				},
				{
					name: 'Zod Validation Error (missing name)',
					fn: () =>
						agent.post(endpoint).send({
							groupId,
							data: { ...task, name: undefined },
						}),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Name is required',
					},
				},
				{
					name: 'Unauthorized (not TechLead)',
					fn: () =>
						agentB.post(endpoint).send({
							groupId,
							data: task,
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not have the required role',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/task/v1/create/' },
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

			expect(res.body).toEqual({
				success: true,
				data: {
					_id: taskId,
					groupId,
					user: [secondUserAccount],
					name: task.name,
					code: task.code,
					feature: task.feature,
					description: task.description,
					isComplete: false,
					priority: task.priority,
				},
				link: [
					{ rel: 'self', href: '/task/v1/get/' },
					{ rel: 'list', href: '/task/v1/list/' },
					{ rel: 'update', href: '/task/v1/update/' },
					{ rel: 'delete', href: '/task/v1/delete/' },
					{ rel: 'solution', href: '/solution/v1/get/' },
					{ rel: 'createSolution', href: '/solution/v1/create/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing task id',
					fn: () => agentB.post(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing task id',
					},
				},
				{
					name: 'Invalid task id',
					fn: () => agentB.post(endpoint).send({ groupId, _id: 'invalid' }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid task id',
					},
				},
				{
					name: 'Task does not belong to the group',
					fn: async () => {
						const res = await agent.post('/group/v1/create').send({
							data: { ...group, name: 'Other Group' },
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
						description: 'Task does not belong to the group',
					},
				},
				{
					name: 'Unauthorized (not a member)',
					fn: async () => {
						const agentC = request.agent(app)
						await registerUser(agentC, 'unprivileged@gmail.com', 'Un', 'User')
						return await agentC.post(endpoint).send({ _id: taskId, groupId })
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
					{ rel: 'self', href: '/task/v1/get/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/list/', () => {
		const endpoint = `${api}/list/`
		test('good request', async () => {
			const res = await agentB.post(endpoint).send({ groupId, page: 0 })
			expect(res.body.success).toBe(true)
			expect(res.body.data.task).toContainEqual(
				expect.objectContaining({
					_id: taskId,
					name: task.name,
					isComplete: false,
					priority: task.priority,
					user: task.user,
				}),
			)
			expect(res.body.data.assign).toStrictEqual([])
			ValidatePagination(res.body.data.metadata)

			expect(res.body.link).toStrictEqual([
				{ rel: 'self', href: '/task/v1/list/' },
				{ rel: 'get', href: '/task/v1/get/' },
				{ rel: 'create', href: '/task/v1/create/' },
			])
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing page number',
					fn: () => agentB.post(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing page number',
					},
				},
				{
					name: 'Invalid page',
					fn: () => agentB.post(endpoint).send({ groupId, page: 'invalid' }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid page',
					},
				},
				{
					name: 'Unauthorized (not a member)',
					fn: async () => {
						const agentC = request.agent(app)
						await registerUser(agentC, 'other2@gmail.com', 'Other', 'Other')
						return await agentC.post(endpoint).send({ groupId, page: 0 })
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
					{ rel: 'self', href: '/task/v1/list/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/', () => {
		const endpoint = `${api}/update/`
		test('good request', async () => {
			// Update the global task object properties
			task.name = 'Updated Task Name'
			task.description = 'Updated Description'
			task.priority = 1

			const res = await agent.put(endpoint).send({
				_id: taskId,
				groupId,
				data: {
					name: task.name,
					description: task.description,
					priority: task.priority,
				},
			})

			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/task/v1/update/' },
					{ rel: 'get', href: '/task/v1/get/' },
					{ rel: 'list', href: '/task/v1/list/' },
					{ rel: 'delete', href: '/task/v1/delete/' },
				],
			})

			// Verify from Agent B (Member)
			const guard = await agentB
				.post(`${api}/get/`)
				.send({ _id: taskId, groupId })
			expect(guard.body.data.name).toBe(task.name)
			expect(guard.body.data.description).toBe(task.description)
			expect(guard.body.data.priority).toBe(task.priority)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing task id',
					fn: () =>
						agent.put(endpoint).send({ groupId, data: { name: 'New' } }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing task id',
					},
				},
				{
					name: 'Missing task data',
					fn: () => agent.put(endpoint).send({ groupId, _id: taskId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing task data',
					},
				},
				{
					name: 'No data to update',
					fn: () =>
						agent.put(endpoint).send({ groupId, _id: taskId, data: {} }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'No data to update',
					},
				},
				{
					name: 'Unauthorized (not TechLead)',
					fn: () =>
						agentB.put(endpoint).send({
							_id: taskId,
							groupId,
							data: { name: 'Attempt' },
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not have the required role',
					},
				},
				{
					name: 'Task does not belong to the group',
					fn: async () => {
						const res = await agent.post('/group/v1/create').send({
							data: { ...group, name: 'Other Group 2' },
						})
						const otherGroupId = res.body.data._id
						return await agent.put(endpoint).send({
							_id: taskId,
							groupId: otherGroupId,
							data: { name: 'Fail' },
						})
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'Task does not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/task/v1/update/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/delete/', () => {
		const endpoint = `${api}/delete/`
		test('good request', async () => {
			const res = await agent.delete(endpoint).send({ _id: taskId, groupId })

			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/task/v1/delete/' },
					{ rel: 'list', href: '/task/v1/list/' },
					{ rel: 'create', href: '/task/v1/create/' },
				],
			})

			// Verify deletion from Agent B (Member)
			const guard = await agentB
				.post(`${api}/get/`)
				.send({ _id: taskId, groupId })
			expect(guard.body.success).toBe(false)
			expect(guard.statusCode).toBe(403)
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing task id',
					fn: () => agent.delete(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing task id',
					},
				},
				{
					name: 'Unauthorized (not TechLead)',
					fn: () => agentB.delete(endpoint).send({ _id: taskId, groupId }),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not have the required role',
					},
				},
				{
					name: 'Task does not belong to the group',
					fn: async () => {
						const res = await agent.post('/group/v1/create').send({
							data: { ...group, name: 'Other Group 3' },
						})
						const otherGroupId = res.body.data._id
						// We need a task to exist but from another group.
						// Actually taskId already exists but in 'groupId', so if we use 'otherGroupId' it should fail.
						return await agent
							.delete(endpoint)
							.send({ _id: taskId, groupId: otherGroupId })
					},
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'Task does not belong to the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/task/v1/delete/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})
})
