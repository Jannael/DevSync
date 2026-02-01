import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import dbModel from './../../../../backend/database/schemas/node/group'
import userDbModel from './../../../../backend/database/schemas/node/user'
import {
	type CustomError,
	Forbidden,
	NotFound,
} from '../../../../backend/error/error'
import type { IEnv } from '../../../../backend/interface/Env'
import type { IGroup } from '../../../../backend/interface/Group'
import type { IRefreshToken } from '../../../../backend/interface/User'
import model from '../../../../backend/model/group/Group.model'
import userModel from '../../../../backend/model/user/User.model'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

beforeAll(async () => {
	await mongoose.connect(DB_URL_ENV_TEST)
})

afterAll(async () => {
	await dbModel.deleteMany({})
	await userDbModel.deleteMany({})
	await mongoose.connection.close()
})

let user: IRefreshToken
let group: IGroup
let secondUser: IRefreshToken
const users: IRefreshToken[] = []

beforeAll(async () => {
	for (let i = 0; i < 5; i++) {
		const user = await userModel.create({
			fullName: 'test',
			account: `test-${i}@gmail.com`,
			pwd: 'test',
			nickName: 'test',
		})
		users.push(user)
	}

	user = await userModel.create({
		fullName: 'test',
		account: 'test@gmail.com',
		pwd: 'test',
		nickName: 'test',
	})

	secondUser = await userModel.create({
		fullName: 'test',
		account: 'secondUser@gmail.com',
		pwd: 'test',
		nickName: 'test',
	})
})

describe('group model', () => {
	describe('create', () => {
		test('', async () => {
			const res = await model.create(
				{
					name: 'test',
					color: '#000000',
				},
				{ account: user.account, fullName: user.fullName },
			)

			group = res

			expect(res).toStrictEqual({
				name: 'test',
				color: '#000000',
				_id: expect.any(Types.ObjectId),
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.create(group, {
							fullName: 'name',
							account: 'notFound@gmail.com',
						})
					},
					error: new NotFound('User not found'),
				},
				{
					fn: async () => {
						for (let i = 0; i < 5; i++) {
							await model.create(
								{
									name: 'test',
									color: '#000000',
								},
								{ account: user.account, fullName: user.fullName },
							)
						}
					},
					error: new Forbidden(
						'Access denied',
						'The user has reached the max number of groups',
					),
				},
			]

			for (const { fn, error } of cases) {
				try {
					await fn()
					throw new Error('Expected function to throw')
				} catch (err: unknown) {
					expect(err).toBeInstanceOf(error.constructor)
					expect((err as CustomError).message).toBe(error.message)
					expect((err as CustomError).description).toBe(error.description)
				}
			}
		})
	})

	describe('exists', () => {
		test('', async () => {
			const res = await model.exists(group._id, user.account)
			expect(res).toEqual(true)
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.exists(group._id, 'notExist@gmail.com')
					},
					error: new Forbidden(
						'Access denied',
						'The group exists but the user is not a techLead',
					),
				},
				{
					fn: async () => {
						await model.exists(new mongoose.Types.ObjectId(), user.account)
					},
					error: new NotFound(
						'Group not found',
						'The group you are trying to access does not exist',
					),
				},
			]

			for (const { fn, error } of cases) {
				try {
					await fn()
					throw new Error('Expected function to throw')
				} catch (err: unknown) {
					expect(err).toBeInstanceOf(error.constructor)
					expect((err as CustomError).message).toBe(error.message)
					expect((err as CustomError).description).toBe(error.description)
				}
			}
		})
	})

	describe('get', () => {
		test('', async () => {
			const res = await model.get(group._id)
			expect(res).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				techLead: [{ fullName: 'test', account: 'test@gmail.com' }],
				name: 'test',
				color: '#000000',
				member: [],
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.get(new mongoose.Types.ObjectId())
					},
					error: new NotFound(
						'Group not found',
						'The group you are trying to access does not exist',
					),
				},
			]

			for (const { fn, error } of cases) {
				try {
					await fn()
					throw new Error('Expected function to throw')
				} catch (err: unknown) {
					expect(err).toBeInstanceOf(error.constructor)
					expect((err as CustomError).message).toBe(error.message)
					expect((err as CustomError).description).toBe(error.description)
				}
			}
		})
	})

	describe('update', () => {
		test('', async () => {
			const res = await model.update(group._id, { color: '#111111' })
			expect(res).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				name: 'test',
				color: '#111111',
			})

			const guard = await model.get(group._id)
			expect(guard).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				techLead: [{ fullName: 'test', account: 'test@gmail.com' }],
				name: 'test',
				color: '#111111',
				member: [],
			})
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () =>
						await model.update(new mongoose.Types.ObjectId(), { name: 'test' }),
					error: new NotFound(
						'Group not found',
						'The group you are trying to update does not exist',
					),
				},
			]

			for (const { fn, error } of cases) {
				try {
					await fn()
					throw new Error('Expected function to throw')
				} catch (err: unknown) {
					expect(err).toBeInstanceOf(error.constructor)
					expect((err as CustomError).message).toBe(error.message)
					expect((err as CustomError).description).toBe(error.description)
				}
			}
		})
	})

	describe('member', () => {
		describe('add', () => {
			test('', async () => {
				const res = await model.member.add(group._id, {
					account: secondUser.account,
					fullName: secondUser.account,
					role: 'documenter',
				})
				expect(res).toEqual(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							for (const el of users.entries()) {
								await model.member.add(group._id, {
									account: el[1].account,
									fullName: el[1].account,
									role: 'documenter',
								})
							}
						},
						error: new Forbidden(
							'Access denied',
							'The group has reached the max number of members',
						),
					},
					{
						fn: async () => {
							const { account, fullName } = user
							await model.member.add(new mongoose.Types.ObjectId(), {
								account,
								fullName,
								role: 'documenter',
							})
						},
						error: new NotFound(
							'Group not found',
							'The group you are trying to access was not found',
						),
					},
				]

				for (const { fn, error } of cases) {
					try {
						await fn()
						throw new Error('Expected function to throw')
					} catch (err: unknown) {
						expect(err).toBeInstanceOf(error.constructor)
						expect((err as CustomError).message).toBe(error.message)
						expect((err as CustomError).description).toBe(error.description)
					}
				}
			})
		})

		describe('update', () => {
			test('', async () => {
				const res = await model.member.update(
					group._id,
					{ fullName: user.fullName, account: user.account },
					{ fullName: 'newFullName', account: user.account },
				)

				expect(res).toEqual(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.member.update(
								new mongoose.Types.ObjectId(),
								{ fullName: user.fullName, account: user.account },
								{ fullName: 'newFullName', account: user.account },
							)
						},
						error: new NotFound('Group not found'),
					},
					{
						fn: async () => {
							await model.member.update(
								group._id,
								{ fullName: 'notExists', account: 'NotExists@gmail.com' },
								{ fullName: 'newFullName', account: user.account },
							)
						},
						error: new NotFound('User not found'),
					},
				]

				for (const { fn, error } of cases) {
					try {
						await fn()
						throw new Error('Expected function to throw')
					} catch (err: unknown) {
						expect(err).toBeInstanceOf(error.constructor)
						expect((err as CustomError).message).toBe(error.message)
						expect((err as CustomError).description).toBe(error.description)
					}
				}
			})
		})

		describe('remove', () => {
			test('', async () => {
				const res = await model.member.remove(group._id, secondUser.account)
				expect(res).toEqual(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.member.remove(group._id, user.account)
						},
						error: new Forbidden(
							'Access denied',
							'You can not remove the last techLead',
						),
					},
					{
						fn: async () => {
							await model.member.remove(
								new mongoose.Types.ObjectId(),
								user.account,
							)
						},
						error: new NotFound('Group not found', 'The group was not found'),
					},
				]

				for (const { fn, error } of cases) {
					try {
						await fn()
						throw new Error('Expected function to throw')
					} catch (err: unknown) {
						expect(err).toBeInstanceOf(error.constructor)
						expect((err as CustomError).message).toBe(error.message)
						expect((err as CustomError).description).toBe(error.description)
					}
				}
			})
		})
	})

	describe('delete', () => {
		test('', async () => {
			const res = await model.delete(group._id)
			expect(res).toEqual(true)
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.delete(new mongoose.Types.ObjectId())
					},
					error: new NotFound(
						'Group not found',
						'The group you are trying to delete does not exist',
					),
				},
			]

			for (const { fn, error } of cases) {
				try {
					await fn()
					throw new Error('Expected function to throw')
				} catch (err: unknown) {
					expect(err).toBeInstanceOf(error.constructor)
					expect((err as CustomError).message).toBe(error.message)
					expect((err as CustomError).description).toBe(error.description)
				}
			}
		})
	})
})
