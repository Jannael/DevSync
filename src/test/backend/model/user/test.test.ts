import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import groupDbModel from './../../../../backend/database/schemas/node/group'
import dbModel from './../../../../backend/database/schemas/node/user'
import {
	type CustomError,
	DuplicateData,
	Forbidden,
	NotFound,
	UserBadRequest,
} from '../../../../backend/error/error'
import type { IEnv } from '../../../../backend/interface/env'
import type { IGroup } from '../../../../backend/interface/group'
import type {
	IRefreshToken,
	IUserGroup,
} from '../../../../backend/interface/user'
import groupModel from '../../../../backend/model/group/model'
import model from '../../../../backend/model/user/model'

dotenv.config({ quiet: true })
const { DB_URL_ENV_TEST } = process.env as Pick<IEnv, 'DB_URL_ENV_TEST'>

beforeAll(async () => {
	await mongoose.connect(DB_URL_ENV_TEST)
})

afterAll(async () => {
	await dbModel.deleteMany({})
	await mongoose.connection.close()
})

describe('user model', () => {
	const group: IGroup[] = []

	let userId: Types.ObjectId
	const notExistUser = new mongoose.Types.ObjectId()

	let user: IRefreshToken = {
		_id: '' as unknown as Types.ObjectId,
		fullName: 'test',
		account: 'test@gmail.com',
		nickName: 'test',
	}

	let secondUser: IRefreshToken = {
		_id: '' as unknown as Types.ObjectId,
		fullName: 'veronica',
		account: 'veronica@gmail.com',
		nickName: 'test',
	}

	let secondTechLead: IRefreshToken = {
		_id: '' as unknown as Types.ObjectId,
		fullName: 'veronicaCruz',
		account: 'veronicaCruz@gmail.com',
		nickName: 'test',
	}

	beforeAll(async () => {
		secondUser = await model.create({
			fullName: 'veronica',
			account: 'veronica@gmail.com',
			nickName: 'test',
			pwd: 'test',
		})

		secondTechLead = await model.create({
			fullName: 'veronicaCruz',
			account: 'veronicaCruz@gmail.com',
			nickName: 'test',
			pwd: 'test',
		})
	})

	afterAll(async () => {
		await groupDbModel.deleteMany({})
	})

	describe('create user', () => {
		test('', async () => {
			const res = await model.create({
				fullName: 'test',
				account: 'test@gmail.com',
				pwd: 'test',
				nickName: 'test',
			})

			userId = res._id
			user = res

			expect(res).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				fullName: 'test',
				account: 'test@gmail.com',
				nickName: 'test',
			})

			for (let i = 0; i < 5; i++) {
				const newGroup = await groupModel.create(
					{
						name: `test-${i}`,
						color: '#000000',
					},
					{ account: user.account, fullName: user.fullName },
				)
				group.push(newGroup)
			}

			const lastGroup = await groupModel.create(
				{
					name: 'test-5',
					color: '#000000',
				},
				{ account: secondTechLead.account, fullName: secondTechLead.fullName },
			)
			group.push(lastGroup)
		})

		test('error', async () => {
			const func = [
				{
					fn: async () => {
						await model.create({
							fullName: 'test',
							account: 'test@gmail.com',
							pwd: 'test',
							nickName: 'test',
						})
					},
					error: new DuplicateData(
						'User already exists',
						'This account belongs to an existing user',
					),
				},
			]

			for (const { fn, error } of func) {
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

	describe('get user', () => {
		test('', async () => {
			const res = await model.get(user.account, { _id: 0, fullName: 1 })
			expect(res).toStrictEqual({ fullName: 'test' })
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.get('example@gmail.com', { _id: 0 })
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

	describe('update user', () => {
		test('', async () => {
			const res = await model.update(
				{
					fullName: 'test1',
				},
				userId,
			)

			expect(res).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				account: 'test@gmail.com',
				fullName: 'test1',
				nickName: 'test',
			})
		})

		test('error', async () => {
			const func = [
				{
					fn: async () => {
						await model.update({}, notExistUser)
					},
					error: new NotFound('User not found'),
				},
				{
					fn: async () => {
						await model.update({ account: 'newAccount@gmail.com' }, userId)
					},
					error: new UserBadRequest(
						'Invalid credentials',
						'You can not change the account here',
					),
				},
				{
					fn: async () => {
						await model.update({ _id: notExistUser }, userId)
					},
					error: new UserBadRequest(
						'Invalid credentials',
						'You can not change the _id',
					),
				},
				{
					fn: async () => {
						await model.update(
							{ refreshToken: ['hello Dexter Morgan'] },
							userId,
						)
					},
					error: new UserBadRequest(
						'Invalid credentials',
						'You can not update the refreshToken',
					),
				},
			]

			for (const { fn, error } of func) {
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

	describe('update user account', () => {
		test('', async () => {
			const res = await model.account.update(userId, 'test2@gmail.com')
			user = res

			expect(res).toStrictEqual({
				_id: expect.any(Types.ObjectId),
				fullName: 'test1',
				account: 'test2@gmail.com',
				nickName: 'test',
			})
		})

		test('error', async () => {
			const func = [
				{
					fn: async () => {
						await model.account.update(notExistUser, 'test@gmail.com')
					},
					error: new NotFound('User not found'),
				},
				{
					fn: async () => {
						await model.account.update(userId, 'test')
					},
					error: new UserBadRequest(
						'Invalid credentials',
						'The account must match example@service.ext',
					),
				},
				{
					fn: async () => {
						await model.account.update(userId, user.account)
					},
					error: new DuplicateData(
						'User already exists',
						'This account belongs to an existing user',
					),
				},
			]

			for (const { fn, error } of func) {
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

	describe('update user password', () => {
		test('', async () => {
			const res = await model.password.update(user.account, 'newPassword')
			expect(res).toEqual(true)
		})

		test('error', async () => {
			const cases = [
				{
					fn: async () => {
						await model.password.update('test', 'test')
					},
					error: new UserBadRequest(
						'Invalid credentials',
						'The account must match example@service.ext',
					),
				},
				{
					fn: async () => {
						await model.password.update(
							'helloDexterMorgan@gmail.com.mx',
							'test',
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

	describe('invitation', () => {
		describe('create user invitation', () => {
			test('', async () => {
				const res = await model.invitation.create(
					{
						account: secondUser.account,
						fullName: secondUser.fullName,
						role: 'techLead',
					},
					{
						_id: group[0]._id,
						name: group[0].name,
						color: group[0].color,
					},
					true,
				)

				expect(res).toBe(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.invitation.create(
								{
									account: user.account,
									fullName: user.fullName,
									role: 'techLead',
								},
								{
									_id: notExistUser,
									name: 'no group',
									color: '#000000',
								},
								true,
							)
						},
						error: new NotFound(
							'Group not found',
							'The group you are trying to access was not found',
						),
					},
					{
						fn: async () => {
							await model.invitation.create(
								{
									account: user.account,
									fullName: user.fullName,
									role: 'techLead',
								},
								{
									_id: notExistUser,
									name: 'no group',
									color: '1234567',
								},
								true,
							)
						},
						error: new UserBadRequest(
							'Invalid credentials',
							'Color must be a valid hex code',
						),
					},
					{
						fn: async () => {
							await model.invitation.create(
								{
									account: 'notfound@gmail.com',
									fullName: user.fullName,
									role: 'techLead',
								},
								{
									_id: group[0]._id,
									name: group[0].name,
									color: group[0].color,
								},
								true,
							)
						},
						error: new NotFound('User not found'),
					},
					{
						fn: async () => {
							await model.invitation.create(
								{
									account: user.account,
									fullName: user.fullName,
									role: 'techLead',
								},
								{
									_id: group[0]._id,
									name: group[0].name,
									color: group[0].color,
								},
								true,
							)
						},
						error: new Forbidden(
							'Access denied',
							'The user with the account test2@gmail.com already belongs to the group',
						),
					},
					{
						fn: async () => {
							await model.invitation.create(
								{
									account: secondUser.account,
									fullName: secondUser.fullName,
									role: 'techLead',
								},
								{
									_id: group[0]._id,
									name: group[0].name,
									color: group[0].color,
								},
								true,
							)
						},
						error: new Forbidden(
							'Access denied',
							'The user with the account veronica@gmail.com already has an invitation for the group',
						),
					},
					{
						fn: async () => {
							for (const [index, el] of group.entries()) {
								if (index === 0 || index === group.length - 1) continue
								await model.invitation.create(
									{
										account: secondUser.account,
										fullName: secondUser.fullName,
										role: 'techLead',
									},
									{
										_id: el._id,
										name: el.name,
										color: el.color,
									},
									true,
								)
							}

							await model.invitation.create(
								{
									account: secondUser.account,
									fullName: secondUser.fullName,
									role: 'techLead',
								},
								{
									_id: group[group.length - 1]._id,
									name: group[group.length - 1].name,
									color: group[group.length - 1].color,
								},
								true,
							)
						},
						error: new Forbidden(
							'Access denied',
							'The user with the account veronica@gmail.com has reached the maximum number of invitations',
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

		describe('get user invitation', () => {
			test('', async () => {
				const res = await model.invitation.get(secondUser._id)
				expect(res).toStrictEqual([
					{
						name: 'test-0',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-1',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-2',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-3',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-4',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
				])
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.invitation.get('' as unknown as Types.ObjectId)
						},
						error: new UserBadRequest(
							'Invalid credentials',
							'The _id is invalid',
						),
					},
					{
						fn: async () => {
							await model.invitation.get(new mongoose.Types.ObjectId())
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

		describe('reject user invitation', () => {
			test('', async () => {
				const res = await model.invitation.reject(
					secondUser.account,
					group[0]._id,
				)
				expect(res).toEqual(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.invitation.reject('notExists@gmail.com', group[0]._id)
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

		describe('remove user invitation', () => {
			test('', async () => {
				for (const { _id } of group) {
					const res = await model.invitation.remove(secondUser.account, _id)
					expect(res).toEqual(true)
				}
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.invitation.remove('notExists@gmail.com', group[0]._id)
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
	})

	describe('group', () => {
		describe('add user group', () => {
			test('', async () => {
				const res = await model.group.add(secondUser.account, group[0])
				expect(res).toEqual(true)
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.group.add(secondUser.account, group[0])
						},
						error: new Forbidden(
							'Access denied',
							`The user with the account ${secondUser.account} already belongs to the group`,
						),
					},
					{
						fn: async () => {
							await model.group.add('notfound@gmail.com', group[0])
						},
						error: new NotFound(
							'User not found',
							'The user with the account notfound@gmail.com was not found',
						),
					},
					{
						fn: async () => {
							for (const [index, el] of group.entries()) {
								if (index === 0) continue
								await model.group.add(secondUser.account, el)
							}
						},
						error: new Forbidden(
							'Access denied',
							`The user with the account ${secondUser.account} has reached the maximum number of groups`,
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

		describe('get user group', () => {
			test('', async () => {
				const res = await model.group.get(secondUser._id)
				expect(res).toStrictEqual([
					{
						name: 'test-0',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-1',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-2',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-3',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-4',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
				])
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.group.get(new mongoose.Types.ObjectId())
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

		describe('update user group', () => {
			test('', async () => {
				const res = await model.group.update(user.account, group[0]._id, {
					name: 'newName',
					color: group[0].color,
				})
				expect(res).toEqual(true)
				const updatedGroups = (await model.group.get(user._id)) as IUserGroup[]
				expect(updatedGroups[0].name).toStrictEqual('newName')
			})

			test('error', async () => {
				const cases = [
					{
						fn: async () => {
							await model.group.update(
								user.account,
								new mongoose.Types.ObjectId(),
								{ name: 'not Found', color: '#000000' },
							)
						},
						error: new NotFound(
							'Group not found',
							"The user it's not in the group",
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

		describe('remove user group', () => {
			test('', async () => {
				const res = await model.group.remove(user.account, group[0]._id)
				expect(res).toBe(true)

				const groups = await model.group.get(user._id)
				expect(groups).toStrictEqual([
					{
						name: 'test-1',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-2',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-3',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
					{
						name: 'test-4',
						_id: expect.any(Types.ObjectId),
						color: '#000000',
					},
				])
			})

			test('error', async () => {
				const func = [
					{
						fn: async () => {
							await model.group.remove(
								user.account,
								new mongoose.Types.ObjectId(),
							)
						},
						error: new NotFound('User not found'),
					},
					{
						fn: async () => {
							await model.group.remove(
								user.account,
								'invalidId' as unknown as Types.ObjectId,
							)
						},
						error: new UserBadRequest(
							'Invalid credentials',
							'The group _id is invalid',
						),
					},
				]
				for (const { fn, error } of func) {
					try {
						await fn()
					} catch (err: unknown) {
						expect(err).toBeInstanceOf(error.constructor)
						expect((err as CustomError).message).toBe(error.message)
						expect((err as CustomError).description).toBe(error.description)
					}
				}
			})
		})
	})

	describe('delete user', () => {
		test('', async () => {
			const res = await model.delete(userId)
			expect(res).toBe(true)
		})

		test('error', async () => {
			const func = [
				{
					fn: async () => {
						await model.delete(notExistUser)
					},
					error: new NotFound('User not found'),
				},
			]

			for (const { fn, error } of func) {
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
