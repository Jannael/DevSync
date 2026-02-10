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

describe('/task/v1/', () => {
	const api = '/task/v1'

	
})
