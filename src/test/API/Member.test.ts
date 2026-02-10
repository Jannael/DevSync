import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { CreateApp } from '../../backend/CreateApp'
import Roles, { DefaultRole } from '../../backend/constant/Role.constant'
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

describe('/member/v1/', () => {
	const api = '/member/v1'

	describe('/get/', () => {
		const endpoint = `${api}/get/`
		test('good request', async () => {
			const res = await agent.post(endpoint).send({ groupId })
			expect(res.body).toEqual({
				success: true,
				data: [
					{
						groupId,
						account: userAccount,
						role: Roles.techLead,
					},
					{
						groupId,
						account: secondUserAccount,
						role: DefaultRole,
					},
				],
				link: [
					{ rel: 'self', href: '/member/v1/get/' },
					{ rel: 'group', href: '/group/v1/get/' },
					{ rel: 'updateRole', href: '/member/v1/update/role/' },
					{ rel: 'remove', href: '/member/v1/remove/' },
				],
			})
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing group id',
					fn: () => agent.post(endpoint).send({}),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing group id',
					},
				},
				{
					name: 'Invalid group id',
					fn: () => agent.post(endpoint).send({ groupId: 'invalid' }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid group id',
					},
				},
				{
					name: 'Unauthorized (not a member)',
					fn: async () => {
						const agentC = request.agent(app)
						await registerUser(
							agentC,
							'unprivileged@gmail.com',
							'Unprivileged',
							'Unprivileged User',
						)
						return await agentC.post(endpoint).send({ groupId })
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
					{ rel: 'self', href: '/member/v1/get/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/update/role/', () => {
		const endpoint = `${api}/update/role/`
		test('good request', async () => {
			const res = await agent
				.patch(endpoint)
				.send({
					groupId,
					account: secondUserAccount,
					newRole: Roles.documenter,
				})

			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/member/v1/update/role/' },
					{ rel: 'get', href: '/member/v1/get/' },
				],
			})

			const guard = await agent.post(`${api}/get/`).send({ groupId })
			expect(guard.body.data).toStrictEqual([
				{
					groupId,
					account: userAccount,
					role: Roles.techLead,
				},
				{
					groupId,
					account: secondUserAccount,
					role: Roles.documenter,
				},
			])
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing account or role',
					fn: () => agent.patch(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing account or role',
					},
				},
				{
					name: 'Invalid account',
					fn: () =>
						agent
							.patch(endpoint)
							.send({ groupId, account: 'invalid', newRole: Roles.developer }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid account',
					},
				},
				{
					name: 'Invalid role',
					fn: () =>
						agent.patch(endpoint).send({
							groupId,
							account: secondUserAccount,
							newRole: 'invalid',
						}),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid role',
					},
				},
				{
					name: 'Unauthorized (not TechLead)',
					fn: () =>
						agentB.patch(endpoint).send({
							groupId,
							account: userAccount,
							newRole: Roles.techLead,
						}),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not have the required role',
					},
				},
				{
					name: 'Group not found',
					fn: () =>
						agent.patch(endpoint).send({
							groupId: new mongoose.Types.ObjectId().toString(),
							account: secondUserAccount,
							newRole: Roles.developer,
						}),
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
					{ rel: 'self', href: '/member/v1/update/role/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})

	describe('/remove/', () => {
		const endpoint = `${api}/remove/`
		test('good request', async () => {
			const res = await agent
				.delete(endpoint)
				.send({ groupId, account: secondUserAccount })
			expect(res.body).toEqual({
				success: true,
				link: [
					{ rel: 'self', href: '/member/v1/remove/' },
					{ rel: 'group', href: '/group/v1/get/' },
				],
			})

			const guard = await agent.post(`${api}/get/`).send({ groupId })
			expect(guard.body.data).toStrictEqual([
				{
					groupId,
					account: userAccount,
					role: Roles.techLead,
				},
			])

			await agentB.post('/group/v1/join/').send({ groupId })
		})

		describe('error request', () => {
			const cases: ISuitErrorCasesResponse = [
				{
					name: 'Missing account',
					fn: () => agent.delete(endpoint).send({ groupId }),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description: 'Missing group id or account',
					},
				},
				{
					name: 'Invalid account',
					fn: () =>
						agent.delete(endpoint).send({ groupId, account: 'invalid' }),
					error: {
						code: 400,
						success: false,
						msg: 'Invalid credentials',
						description: 'Invalid account',
					},
				},
				{
					name: 'Unauthorized (not TechLead)',
					fn: () =>
						agentB.delete(endpoint).send({ groupId, account: userAccount }),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'You do not have the required role',
					},
				},
				{
					name: 'Cannot remove the last techLead',
					fn: () =>
						agent.delete(endpoint).send({ groupId, account: userAccount }),
					error: {
						code: 403,
						success: false,
						msg: 'Access denied',
						description: 'Cannot remove the last techLead from the group',
					},
				},
			]

			ValidateResponseError({
				cases,
				link: [
					{ rel: 'self', href: '/member/v1/remove/' },
					{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
					{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
				],
			})
		})
	})
})
