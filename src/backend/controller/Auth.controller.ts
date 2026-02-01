import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import cookiesConfig from '../config/Cookies.config'
import jwtConfig from '../config/Jwt.config'
import {
	DatabaseError,
	NotFound,
	UserBadRequest,
} from '../error/Error.constructor'
import type { IEnv } from '../interface/Env'
import model from '../model/Auth.model'
import { encrypt } from '../utils/auth/EncryptToken.utils'
import getToken from '../utils/auth/GetToken.utils'
import {
	decrypt,
	generateCode,
	sendEmail,
	verifyEmail,
} from '../utils/Omit.utils'

dotenv.config({ quiet: true })
const {
	JWT_ACCESS_TOKEN_ENV,
	JWT_REFRESH_TOKEN_ENV,
	JWT_AUTH_ENV,
	TEST_PWD_ENV,
	CRYPTO_AUTH_ENV,
	CRYPTO_ACCESS_TOKEN_ENV,
	CRYPTO_REFRESH_TOKEN_ENV,
} = process.env as Pick<
	IEnv,
	| 'JWT_ACCESS_TOKEN_ENV'
	| 'JWT_REFRESH_TOKEN_ENV'
	| 'JWT_AUTH_ENV'
	| 'TEST_PWD_ENV'
	| 'CRYPTO_AUTH_ENV'
	| 'CRYPTO_ACCESS_TOKEN_ENV'
	| 'CRYPTO_REFRESH_TOKEN_ENV'
>

const service = {
	request: {
		code: async (req: Request, res: Response): Promise<boolean> => {
			let code = generateCode()
			if (req.body?.account === undefined || !verifyEmail(req.body?.account))
				throw new UserBadRequest(
					'Invalid credentials',
					'Missing or invalid account, the account must match the following pattern example@service.ext',
				)

			if (
				req.body?.TEST_PWD !== undefined &&
				req.body?.TEST_PWD === TEST_PWD_ENV
			)
				code = generateCode(req.body?.TEST_PWD)

			if (req.body?.TEST_PWD === undefined)
				await sendEmail(req.body?.account, code)

			const jwtEncrypt = encrypt(
				{ code, account: req.body?.account },
				CRYPTO_AUTH_ENV,
				JWT_AUTH_ENV,
				jwtConfig.code,
			)
			res.cookie('code', jwtEncrypt, cookiesConfig.code)
			return true
		},
		accessToken: async (req: Request, res: Response): Promise<boolean> => {
			if (req.cookies?.refreshToken === undefined)
				throw new UserBadRequest('Missing data', 'Missing refreshToken')
			let refreshToken: JwtPayload | string
			const jwtRefreshToken = decrypt(
				req.cookies.refreshToken,
				CRYPTO_REFRESH_TOKEN_ENV,
				'refreshToken',
			)
			const decoded = jwt.decode(jwtRefreshToken)

			try {
				refreshToken = jwt.verify(jwtRefreshToken, JWT_REFRESH_TOKEN_ENV)
			} catch (e) {
				if (
					(e as Error).name === 'TokenExpiredError' &&
					decoded !== null &&
					typeof decoded !== 'string' &&
					decoded._id !== undefined
				) {
					await model.RefreshToken.Remove({
						token: jwtRefreshToken,
						userId: decoded._id,
					})
				}
				throw e
			}

			if (typeof refreshToken === 'string')
				throw new UserBadRequest('Invalid credentials')

			const dbValidation = await model.RefreshToken.Verify({
				token: req.cookies.refreshToken,
				userId: refreshToken._id as Types.ObjectId,
			})

			if (!dbValidation)
				throw new UserBadRequest('Invalid credentials', 'You need to log in')

			delete refreshToken.iat
			delete refreshToken.exp

			const accessToken = encrypt(
				refreshToken,
				CRYPTO_ACCESS_TOKEN_ENV,
				JWT_ACCESS_TOKEN_ENV,
				jwtConfig.accessToken,
			)
			res.cookie('accessToken', accessToken, cookiesConfig.accessToken)
			return true
		},
		refreshToken: {
			code: async (req: Request, res: Response): Promise<boolean> => {
				if (
					req.body?.account === undefined ||
					req.body?.pwd === undefined ||
					!verifyEmail(req.body?.account)
				)
					throw new UserBadRequest(
						'Invalid credentials',
						'Missing or invalid data the account must match the following pattern example@service.ext',
					)

				let code = generateCode()

				if (
					req.body?.TEST_PWD !== undefined &&
					req.body?.TEST_PWD === TEST_PWD_ENV
				)
					code = generateCode(req.body?.TEST_PWD)

				const user = await model.Login({
					account: req.body?.account,
					pwd: req.body?.pwd,
				})

				if (req.body?.TEST_PWD === undefined)
					await sendEmail(req.body?.account, code)

				const token = encrypt(
					user as unknown as Record<string, unknown>,
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)
				const hashCode = encrypt(
					{ code },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)

				res.cookie('tokenR', token, cookiesConfig.code)
				res.cookie('codeR', hashCode, cookiesConfig.code)

				return true
			},
			confirm: async (req: Request, res: Response): Promise<boolean> => {
				if (req.body?.code === undefined)
					throw new UserBadRequest('Missing data', 'You need to send the code')

				const code = getToken(req, 'codeR', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)
				const user = getToken(req, 'tokenR', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)
				if (code.code !== req.body?.code)
					throw new UserBadRequest('Invalid credentials', 'Wrong code')

				delete user.iat
				delete user.exp

				const refreshToken = encrypt(
					user,
					CRYPTO_REFRESH_TOKEN_ENV,
					JWT_REFRESH_TOKEN_ENV,
					jwtConfig.refreshToken,
				)
				const accessToken = encrypt(
					user,
					CRYPTO_ACCESS_TOKEN_ENV,
					JWT_ACCESS_TOKEN_ENV,
					jwtConfig.accessToken,
				)

				const savedInDB = await model.RefreshToken.Save({
					token: refreshToken,
					userId: user._id,
				})
				if (!savedInDB)
					throw new DatabaseError(
						'Failed to save',
						'The session was not saved please try again',
					)

				res.cookie('refreshToken', refreshToken, cookiesConfig.refreshToken)
				res.cookie('accessToken', accessToken, cookiesConfig.accessToken)
				res.clearCookie('tokenR')
				res.clearCookie('codeR')

				return true
			},
		},
		logout: async (req: Request, res: Response): Promise<boolean> => {
			const decoded = getToken(
				req,
				'refreshToken',
				JWT_REFRESH_TOKEN_ENV,
				CRYPTO_REFRESH_TOKEN_ENV,
			)
			await model.RefreshToken.Remove({
				token: req.cookies.refreshToken,
				userId: decoded._id,
			})
			res.clearCookie('refreshToken')
			res.clearCookie('accessToken')
			return true
		},
	},
	verify: {
		code: async (req: Request, res: Response): Promise<boolean> => {
			if (req.body?.code === undefined)
				throw new UserBadRequest('Missing data', 'You did not send the code')

			const decodedCode = getToken(req, 'code', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)
			if (req.body?.code !== decodedCode.code)
				throw new UserBadRequest('Invalid credentials', 'Wrong code')
			if (req.body?.account !== decodedCode.account)
				throw new UserBadRequest(
					'Invalid credentials',
					'You tried to change the account now your banned forever',
				)

			res.clearCookie('code')

			const encrypted = encrypt(
				{ account: decodedCode.account },
				CRYPTO_AUTH_ENV,
				JWT_AUTH_ENV,
				jwtConfig.code,
			)
			res.cookie('account', encrypted, cookiesConfig.code)
			return true
		},
	},
	account: {
		request: {
			code: async (req: Request, res: Response): Promise<boolean> => {
				let code = generateCode()
				let codeNewAccount = generateCode()

				if (
					req.body?.newAccount === undefined ||
					!verifyEmail(req.body?.newAccount)
				)
					throw new UserBadRequest(
						'Missing data',
						'Missing or invalid data check the newAccount you sent',
					)

				const accessToken = getToken(
					req,
					'accessToken',
					JWT_ACCESS_TOKEN_ENV,
					CRYPTO_ACCESS_TOKEN_ENV,
				)

				if (
					req.body?.TEST_PWD !== undefined &&
					req.body?.TEST_PWD === TEST_PWD_ENV
				) {
					code = generateCode(TEST_PWD_ENV)
					codeNewAccount = generateCode(TEST_PWD_ENV)
				}

				if (req.body?.TEST_PWD === undefined) {
					await sendEmail(accessToken.account, code)
					await sendEmail(req.body?.newAccount, codeNewAccount)
				}

				if (accessToken.account === req.body?.newAccount)
					throw new UserBadRequest(
						'Invalid credentials',
						'The new account can not be the same as the current one',
					)

				const codeEncrypted = encrypt(
					{ code },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)
				const codeNewAccountEncrypted = encrypt(
					{ code: codeNewAccount, account: req.body?.newAccount },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.codeNewAccount,
				)

				res.cookie('currentAccount', codeEncrypted, cookiesConfig.code)
				res.cookie(
					'newAccount',
					codeNewAccountEncrypted,
					cookiesConfig.codeNewAccount,
				)

				return true
			},
		},
		verify: {
			code: async (req: Request, res: Response): Promise<boolean> => {
				if (
					req.body?.codeCurrentAccount === undefined ||
					req.body?.codeNewAccount === undefined
				)
					throw new UserBadRequest(
						'Invalid credentials',
						'You need to send the verification codes',
					)

				const code = getToken(
					req,
					'currentAccount',
					JWT_AUTH_ENV,
					CRYPTO_AUTH_ENV,
				)
				const codeNewAccount = getToken(
					req,
					'newAccount',
					JWT_AUTH_ENV,
					CRYPTO_AUTH_ENV,
				)

				if (code.code !== req.body?.codeCurrentAccount)
					throw new UserBadRequest(
						'Invalid credentials',
						'Current account code is wrong',
					)
				if (codeNewAccount.code !== req.body?.codeNewAccount)
					throw new UserBadRequest(
						'Invalid credentials',
						'New account code is wrong',
					)

				res.clearCookie('currentAccount')
				res.clearCookie('newAccount')

				const account = encrypt(
					{ account: codeNewAccount.account },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)

				res.cookie('newAccount_account', account, cookiesConfig.code)
				return true
			},
		},
	},
	pwd: {
		request: {
			code: async (req: Request, res: Response): Promise<boolean> => {
				if (req.body?.account === undefined || !verifyEmail(req.body?.account))
					throw new UserBadRequest(
						'Missing data',
						'Missing or invalid account it must match example@service.ext',
					)

				const dbValidation = await model.Exists({ account: req.body?.account })
				if (!dbValidation) throw new NotFound('User not found')

				let code = generateCode()
				if (
					req.body?.TEST_PWD !== undefined &&
					req.body?.TEST_PWD === TEST_PWD_ENV
				)
					code = generateCode(TEST_PWD_ENV)

				if (req.body?.TEST_PWD === undefined)
					await sendEmail(req.body?.account, code)

				const hashCode = encrypt(
					{ code, account: req.body?.account },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)
				res.cookie('pwdChange', hashCode, cookiesConfig.code)
				return true
			},
		},
		verify: {
			code: async (req: Request, res: Response): Promise<boolean> => {
				if (
					req.body?.code === undefined ||
					req.body?.newPwd === undefined ||
					req.body?.account === undefined
				)
					throw new UserBadRequest(
						'Missing data',
						'You need to send code, newPwd and account',
					)

				const code = getToken(req, 'pwdChange', JWT_AUTH_ENV, CRYPTO_AUTH_ENV)

				if (code.code !== req.body?.code)
					throw new UserBadRequest('Invalid credentials', 'Wrong code')
				if (code.account !== req.body?.account)
					throw new UserBadRequest(
						'Invalid credentials',
						'You tried to change the account now your banned forever',
					)

				const hash = encrypt(
					{ pwd: req.body?.newPwd, account: code.account },
					CRYPTO_AUTH_ENV,
					JWT_AUTH_ENV,
					jwtConfig.code,
				)

				res.cookie('newPwd', hash, cookiesConfig.code)
				res.clearCookie('pwdChange')
				return true
			},
		},
	},
}

export default service
