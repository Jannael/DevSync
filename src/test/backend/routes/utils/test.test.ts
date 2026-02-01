import type { Server } from 'node:http'
import dotenv from 'dotenv'
import type { Express } from 'express'
import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../../../../backend/app'
import dbGroupModel from './../../../../backend/database/schemas/node/group'
import dbUserModel from './../../../../backend/database/schemas/node/user'
import type { IEnv } from '../../../../backend/interface/env'
import type { IGroup } from '../../../../backend/interface/group'
import type { IRefreshToken } from '../../../../backend/interface/user'
import groupModel from '../../../../backend/model/group/Group.model'
import userModel from '../../../../backend/model/user/User.model'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST, TEST_PWD_ENV } = process.env as Pick<
	IEnv,
	'DB_URL_ENV_TEST' | 'TEST_PWD_ENV'
>

let user: IRefreshToken
let secondUser: IRefreshToken
let group: IGroup
let agent: ReturnType<typeof request.agent>

afterAll(async () => {
	await dbUserModel.deleteMany({})
	await dbGroupModel.deleteMany({})
	await mongoose.connection.close()
})

describe('auth router', () => {
	let app: Express
	let server: Server

	beforeAll(async () => {
		app = await createApp(DB_URL_ENV_TEST, 'test')
		agent = await request.agent(app)
		secondUser = await userModel.create({
			fullName: 'second test',
			account: 'secondUser@gmail.com',
			pwd: 'test',
			nickName: 'second test',
		})

		user = await userModel.create({
			fullName: 'test',
			account: 'test@gmail.com',
			pwd: 'test',
			nickName: 'test',
		}) // user that it's all around in the test as the main user

		group = await groupModel.create(
			{
				name: 'first group',
				color: '#000000',
				techLead: [
					{ account: secondUser.account, fullName: secondUser.fullName },
				],
			},
			{ account: user.account, fullName: user.fullName },
		)

		await agent.post('/auth/v1/request/refreshToken/code/').send({
			account: user.account,
			pwd: 'test',
			TEST_PWD: TEST_PWD_ENV,
		})
		await agent.post('/auth/v1/request/refreshToken/').send({
			code: '1234',
		})
		server = app.listen(3000)
	})

	afterAll(async () => {
		server.close()
	})

	describe('utils', () => {
		test('health checker', async () => {
			const res = await request(server).get('/utils/v1/healthChecker/')
			expect(res.body).toStrictEqual({ ok: 1 })
		})

		describe('/protected/', () => {
			test('', async () => {
				const res = await agent.post('/utils/v1/protected/').send({
					groupId: group._id,
				})

				expect(res.body.ok).toEqual(1)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await agent.delete('/user/v1/delete/group/').send({
								_id: group._id,
							})

							const res = await agent.post('/utils/v1/protected/').send({
								groupId: group._id,
							})

							return res
						},
						error: {
							code: 403,
							msg: 'Access denied',
							description: 'You do not belong to the group',
							success: false,
						},
					},
					{
						fn: async () => {
							await agent.post('/user/v1/add/group/').send({
								_id: group._id,
							})

							const res = await agent.post('/utils/v1/protected/').send({
								groupId: group._id,
							})

							return res
						},
						error: {
							code: 403,
							msg: 'Access denied',
							description: 'You do not have the required role',
							success: false,
						},
					},
				]

				for (const { fn, error } of cases) {
					const res = await fn()
					expect(res.statusCode).toEqual(error.code)
					expect(res.body.msg).toEqual(error.msg)
					expect(res.body.success).toEqual(error.success)
					expect(res.body.description).toEqual(error.description)
				}
			})
		})
	})
})
