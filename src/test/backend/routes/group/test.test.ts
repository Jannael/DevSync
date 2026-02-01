import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../../../backend/app'
import groupDbModel from './../../../../backend/database/schemas/node/group'
import userDbModel from './../../../../backend/database/schemas/node/user'
import type { IEnv } from '../../../../backend/interface/Env'
import type { IGroup } from '../../../../backend/interface/Group'
import userModel from '../../../../backend/model/user/User.model'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<
	IEnv,
	'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'
>

let app: Express
let agent: ReturnType<typeof request.agent>
let secondAgent: ReturnType<typeof request.agent>
let group: IGroup

beforeAll(async () => {
	app = await createApp(DB_URL_ENV_TEST, 'test')
	agent = await request.agent(app)
	secondAgent = await request.agent(app)

	// get two agents tokens
	await userModel.create({
		fullName: 'test',
		account: 'firstUser@gmail.com',
		pwd: 'test',
		nickName: 'test',
	})
	await userModel.create({
		fullName: 'test',
		account: 'secondUser@gmail.com',
		pwd: 'test',
		nickName: 'test',
	})

	await agent.post('/auth/v1/request/refreshToken/code/').send({
		account: 'firstUser@gmail.com',
		pwd: 'test',
		TEST_PWD: TEST_PWD_ENV,
	})
	await agent.post('/auth/v1/request/refreshToken/').send({
		code: '1234',
	})

	await secondAgent.post('/auth/v1/request/refreshToken/code/').send({
		account: 'secondUser@gmail.com',
		pwd: 'test',
		TEST_PWD: TEST_PWD_ENV,
	})
	await secondAgent.post('/auth/v1/request/refreshToken/').send({
		code: '1234',
	})
})

afterAll(async () => {
	await groupDbModel.deleteMany({})
	await userDbModel.deleteMany({})
	await mongoose.connection.close()
})

describe('/group/v1/', () => {
	const path = '/group/v1'
	describe('/create/', () => {
		const endpoint = `${path}/create/`
		test('', async () => {
			const res = await agent.post(endpoint).send({
				name: 'firstGroup',
				color: '#000000',
				techLead: ['secondUser@gmail.com'],
			})

			group = res.body.result

			expect(res.body).toStrictEqual({
				success: true,
				result: {
					name: 'firstGroup',
					color: '#000000',
					_id: expect.any(String),
				},
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => await agent.post(endpoint),
					error: {
						code: 400,
						success: false,
						msg: 'Missing data',
						description:
							'You need to send at least the name and color for the group you want to create',
					},
				},
			]

			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})

	describe('/get/', () => {
		const endpoint = `${path}/get/`
		test('', async () => {
			const res = await agent.post(endpoint).send({
				_id: group._id,
			})

			expect(res.body.success).toEqual(true)
			expect(res.body.result).toStrictEqual({
				_id: expect.any(String),
				techLead: [
					{ fullName: 'test', account: 'secondUser@gmail.com' },
					{ fullName: 'test', account: 'firstUser@gmail.com' },
				],
				name: 'firstGroup',
				color: '#000000',
				member: [],
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						const agent = await request.agent(app)
						await userModel.create({
							fullName: 'test',
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							nickName: 'test',
						})
						await agent.post('/auth/v1/request/refreshToken/code/').send({
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							TEST_PWD: TEST_PWD_ENV,
						})
						await agent.post('/auth/v1/request/refreshToken/').send({
							code: '1234',
						})
						return await agent.post(endpoint).send({
							_id: group._id,
						})
					},
					error: {
						code: 403,
						msg: 'Access denied',
						description: 'You do not belong to any group',
						success: false,
					},
				},
				{
					fn: async () => {
						const agent = await request.agent(app)
						await agent.post('/auth/v1/request/refreshToken/code/').send({
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							TEST_PWD: TEST_PWD_ENV,
						})
						await agent.post('/auth/v1/request/refreshToken/').send({
							code: '1234',
						})
						await agent.post('/user/v1/add/group').send({
							_id: group._id,
						})

						const res = await agent.post(endpoint).send({
							_id: new mongoose.Types.ObjectId(),
						})

						await agent.delete('/user/v1/delete/group/').send({
							_id: group._id,
						})
						return res
					},
					error: {
						code: 403,
						msg: 'Access denied',
						description:
							'You do not belong to the group you are trying to access',
						success: false,
					},
				},
			]
			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})

	describe('/update/', () => {
		const endpoint = `${path}/update/`
		test('', async () => {
			const res = await agent.put(endpoint).send({
				_id: group._id,
				data: {
					name: 'newGroupName',
				},
			})

			expect(res.body).toStrictEqual({
				success: true,
				result: {
					_id: expect.any(String),
					name: 'newGroupName',
					color: '#000000',
				},
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						const agent = await request.agent(app)
						await agent.post('/auth/v1/request/refreshToken/code/').send({
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							TEST_PWD: TEST_PWD_ENV,
						})
						await agent.post('/auth/v1/request/refreshToken/').send({
							code: '1234',
						})

						return await agent.put(endpoint).send({
							_id: group._id,
							data: {
								name: 'newGroupName',
							},
						})
					},
					error: {
						code: 403,
						msg: 'Access denied',
						description: 'The group exists but the user is not a techLead',
						success: false,
					},
				},
			]

			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})

	describe('/member/update/role/', () => {
		const endpoint = `${path}/member/update/role/`
		test('', async () => {
			const res = await agent.patch(endpoint).send({
				_id: group._id,
				role: 'developer',
				account: 'secondUser@gmail.com',
			})
			expect(res.body.success).toEqual(true)

			const guard = await agent.post(`${path}/get/`).send({
				_id: group._id,
			})
			expect(guard.body.result.techLead).toEqual([
				{ fullName: 'test', account: 'firstUser@gmail.com' },
			])
			expect(guard.body.result.member).toEqual([
				{
					account: 'secondUser@gmail.com',
					fullName: 'test',
					role: 'developer',
				},
			])
		})
		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						const agent = await request.agent(app)
						await agent.post('/auth/v1/request/refreshToken/code/').send({
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							TEST_PWD: TEST_PWD_ENV,
						})
						await agent.post('/auth/v1/request/refreshToken/').send({
							code: '1234',
						})

						return await agent.patch(endpoint).send({
							_id: group._id,
							role: 'developer',
							account: 'secondUser@gmail.com',
						})
					},
					error: {
						code: 403,
						msg: 'Access denied',
						description: 'The group exists but the user is not a techLead',
						success: false,
					},
				},
			]

			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})

	describe('/member/remove/', () => {
		const endpoint = `${path}/member/remove/`
		test('', async () => {
			const res = await agent.delete(endpoint).send({
				_id: group._id,
				account: 'secondUser@gmail.com',
			})

			expect(res.body.success).toEqual(true)
			const guard = await agent.post(`${path}/get/`).send({
				_id: group._id,
			})

			expect(guard.body.member).toStrictEqual(undefined)
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						const agent = await request.agent(app)
						await agent.post('/auth/v1/request/refreshToken/code/').send({
							account: 'errorTestCase1@gmail.com',
							pwd: 'test',
							TEST_PWD: TEST_PWD_ENV,
						})
						await agent.post('/auth/v1/request/refreshToken/').send({
							code: '1234',
						})

						return await agent.delete(endpoint).send({
							_id: group._id,
							account: 'secondUser@gmail.com',
						})
					},
					error: {
						code: 403,
						msg: 'Access denied',
						description: 'The group exists but the user is not a techLead',
						success: false,
					},
				},
			]

			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})

	describe('/delete/', () => {
		const endpoint = `${path}/delete/`
		test('', async () => {
			const res = await agent.delete(endpoint).send({
				_id: group._id,
			})

			expect(res.body.success).toBe(true)
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => await agent.delete(endpoint).send({ _id: group._id }),
					error: {
						code: 404,
						msg: 'Group not found',
						description: 'The group you are trying to access does not exist',
						success: false,
					},
				},
			]

			for (const { fn, error } of cases) {
				const res = await fn()
				expect(res.statusCode).toEqual(error.code)
				expect(res.body.success).toEqual(error.success)
				expect(res.body.msg).toEqual(error.msg)
				expect(res.body.description).toEqual(error.description)
			}
		})
	})
})
