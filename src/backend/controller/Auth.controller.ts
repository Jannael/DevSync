import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import cookiesConfig from '../config/Cookies.config'
import CookiesKeys from '../constant/Cookie.constant'
import {
	DatabaseError,
	NotFound,
	ServerError,
	UserBadRequest,
} from '../error/Error.instances'
import type { IEnv } from '../interface/Env'
import AuthModel from '../model/Auth.model'
import Decrypt from '../secret/DecryptToken.utils'
import {
	GenerateAccessToken,
	GenerateAuth,
	GenerateRefreshToken,
} from '../secret/GenerateToken'
import { GetAccessToken, GetAuth, GetRefreshToken } from '../secret/GetToken'
import SendEmail from '../service/SendEmail.service'
import GenerateCode from '../utils/auth/GenerateCode.utils'
import RemoveCookies from '../utils/RemoveCookies.utils'
import AccountValidator from '../validator/Account.validator'

dotenv.config({ quiet: true })
const { JWT_REFRESH_TOKEN_ENV, CRYPTO_REFRESH_TOKEN_ENV } = process.env as Pick<
	IEnv,
	| 'JWT_ACCESS_TOKEN_ENV'
	| 'JWT_REFRESH_TOKEN_ENV'
	| 'JWT_AUTH_ENV'
	| 'TEST_PWD_ENV'
	| 'CRYPTO_AUTH_ENV'
	| 'CRYPTO_ACCESS_TOKEN_ENV'
	| 'CRYPTO_REFRESH_TOKEN_ENV'
>

const Controller = {
	request: {
		Code: async (req: Request, res: Response): Promise<boolean> => {
			if (req.body?.account === undefined)
				throw new UserBadRequest('Invalid credentials', 'Missing account')
			if (!AccountValidator(req.body?.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')
			const code = GenerateCode(req.body?.TEST_PWD)

			if (req.body?.TEST_PWD === undefined)
				await SendEmail({ account: req.body?.account, code })

			const jwtEncrypt = GenerateAuth({
				content: { code, account: req.body?.account },
			})

			res.cookie(CookiesKeys.code, jwtEncrypt, cookiesConfig.code)
			return true
		},
		AccessToken: async (req: Request, res: Response): Promise<boolean> => {
			if (req.cookies?.refreshToken === undefined)
				throw new UserBadRequest('Missing data', 'Missing refreshToken')

			let refreshToken: JwtPayload | string

			const jwtRefreshToken = Decrypt({
				encryptedText: req.cookies.refreshToken,
				key: CRYPTO_REFRESH_TOKEN_ENV,
				tokenName: 'refreshToken',
			})

			try {
				refreshToken = jwt.verify(jwtRefreshToken, JWT_REFRESH_TOKEN_ENV)
			} catch (e) {
				const decoded = jwt.decode(jwtRefreshToken)
				if (
					(e as Error).name === 'TokenExpiredError' &&
					decoded !== null &&
					typeof decoded !== 'string' &&
					decoded._id !== undefined
				) {
					await AuthModel.RefreshToken.Remove({
						token: jwtRefreshToken,
						userId: decoded._id,
					})
				}
				throw e
			}

			if (typeof refreshToken === 'string')
				throw new UserBadRequest('Invalid credentials')

			const dbValidation = await AuthModel.RefreshToken.Verify({
				token: req.cookies.refreshToken,
				userId: refreshToken._id as Types.ObjectId,
			})

			if (!dbValidation)
				throw new UserBadRequest('Invalid credentials', 'You need to login')

			delete refreshToken.iat
			delete refreshToken.exp

			const accessToken = GenerateAccessToken({ content: refreshToken })

			res.cookie(
				CookiesKeys.accessToken,
				accessToken,
				cookiesConfig.accessToken,
			)

			return true
		},
		Logout: async (req: Request, res: Response): Promise<boolean> => {
			const refreshToken = GetRefreshToken({ req })

			const removed = await AuthModel.RefreshToken.Remove({
				token: req.cookies.refreshToken,
				userId: refreshToken._id,
			})

			if (!removed)
				throw new ServerError('Operation Failed', 'The session was not removed')

			RemoveCookies({
				keys: [CookiesKeys.refreshToken, CookiesKeys.accessToken],
				res,
			})

			return true
		},
	},
	RefreshToken: {
		Code: async (req: Request, res: Response): Promise<boolean> => {
			if (req.body?.account === undefined || req.body?.pwd === undefined)
				throw new UserBadRequest('Invalid credentials', 'Missing data')
			if (!AccountValidator(req.body?.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const code = GenerateCode(req.body?.TEST_PWD)

			const user = await AuthModel.Login({
				account: req.body?.account,
				pwd: req.body?.pwd,
			})

			if (!user)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid account or password',
				)

			if (req.body?.TEST_PWD === undefined)
				await SendEmail({ account: req.body?.account, code })

			const token = GenerateAuth({
				content: user as unknown as Record<string, unknown>,
			})

			const hashCode = GenerateAuth({ content: { code } })

			res.cookie(CookiesKeys.genericToken, token, cookiesConfig.code)
			res.cookie(
				CookiesKeys.refreshTokenRequestCode,
				hashCode,
				cookiesConfig.code,
			)

			return true
		},
		Confirm: async (req: Request, res: Response): Promise<boolean> => {
			if (req.body?.code === undefined)
				throw new UserBadRequest('Missing data', 'You need to send the code')

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.refreshTokenRequestCode,
			})
			const user = GetAuth({
				req,
				tokenName: CookiesKeys.genericToken,
			})

			if (code.code !== req.body?.code)
				throw new UserBadRequest('Invalid credentials', 'Wrong code')

			delete user.iat
			delete user.exp

			const refreshToken = GenerateRefreshToken({
				content: user,
			})

			const accessToken = GenerateAccessToken({
				content: user,
			})

			const savedInDB = await AuthModel.RefreshToken.Save({
				token: refreshToken,
				userId: user._id,
			})

			if (!savedInDB)
				throw new DatabaseError(
					'Failed to save',
					'The session was not saved please try again',
				)

			res.cookie(
				CookiesKeys.refreshToken,
				refreshToken,
				cookiesConfig.refreshToken,
			)
			res.cookie(
				CookiesKeys.accessToken,
				accessToken,
				cookiesConfig.accessToken,
			)
			res.clearCookie(CookiesKeys.genericToken)
			res.clearCookie(CookiesKeys.refreshTokenRequestCode)

			return true
		},
	},
	VerifyCode: async (req: Request, res: Response): Promise<boolean> => {
		if (req.body?.code === undefined)
			throw new UserBadRequest('Missing data', 'You did not send the code')

		const decodedCode = GetAuth({
			req,
			tokenName: CookiesKeys.code,
		})

		if (req.body?.code !== decodedCode.code)
			throw new UserBadRequest('Invalid credentials', 'Wrong code')
		if (req.body?.account !== decodedCode.account)
			throw new UserBadRequest(
				'Invalid credentials',
				'You tried to change the account now your banned forever',
			)

		res.clearCookie('code')

		const encrypted = GenerateAuth({
			content: { account: decodedCode.account },
		})

		res.cookie(CookiesKeys.account, encrypted, cookiesConfig.code)
		return true
	},
	Account: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			const code = GenerateCode(req.body?.TEST_PWD)
			const codeNewAccount = GenerateCode(req.body?.TEST_PWD)

			if (req.body?.newAccount === undefined)
				throw new UserBadRequest('Missing data', 'Missing account')
			if (!AccountValidator(req.body?.newAccount))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const accessToken = GetAccessToken({ req })

			if (req.body?.TEST_PWD === undefined) {
				await SendEmail({ account: accessToken.account, code })
				await SendEmail({
					account: req.body?.newAccount,
					code: codeNewAccount,
				})
			}

			if (accessToken.account === req.body?.newAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'The new account can not be the same as the current one',
				)

			const codeEncrypted = GenerateAuth({ content: { code } })

			const codeNewAccountEncrypted = GenerateAuth({
				content: { code: codeNewAccount, account: req.body?.newAccount },
			})

			res.cookie(
				CookiesKeys.codeCurrentAccount,
				codeEncrypted,
				cookiesConfig.code,
			)
			res.cookie(
				CookiesKeys.codeNewAccount,
				codeNewAccountEncrypted,
				cookiesConfig.codeNewAccount,
			)

			return true
		},
		VerifyCode: async (req: Request, res: Response): Promise<boolean> => {
			if (
				req.body?.codeCurrentAccount === undefined ||
				req.body?.codeNewAccount === undefined
			)
				throw new UserBadRequest(
					'Invalid credentials',
					'You need to send the verification codes',
				)

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.codeCurrentAccount,
			})

			const codeNewAccount = GetAuth({
				req,
				tokenName: CookiesKeys.codeNewAccount,
			})

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

			res.clearCookie(CookiesKeys.codeCurrentAccount)
			res.clearCookie(CookiesKeys.codeNewAccount)

			const account = GenerateAuth({
				content: { account: codeNewAccount.account },
			})

			res.cookie(CookiesKeys.confirmNewAccount, account, cookiesConfig.code)
			return true
		},
	},
	Pwd: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			if (req.body?.account === undefined)
				throw new UserBadRequest(
					'Missing data',
					'Missing or invalid account it must match example@service.ext',
				)

			if (!AccountValidator(req.body?.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const dbValidation = await AuthModel.Exists({
				account: req.body?.account,
			})

			if (!dbValidation) throw new NotFound('User not found')

			const code = GenerateCode(req.body?.TEST_PWD)

			if (req.body?.TEST_PWD === undefined)
				await SendEmail({ account: req.body?.account, code })

			const hashCode = GenerateAuth({
				content: { code, account: req.body?.account },
			})

			res.cookie(CookiesKeys.pwdChange, hashCode, cookiesConfig.code)
			return true
		},
		VerifyCode: async (req: Request, res: Response): Promise<boolean> => {
			if (
				req.body?.code === undefined ||
				req.body?.newPwd === undefined ||
				req.body?.account === undefined
			)
				throw new UserBadRequest(
					'Missing data',
					'You need to send code, newPwd and account',
				)

			if (!AccountValidator(req.body?.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.pwdChange,
			})

			if (code.code !== req.body?.code)
				throw new UserBadRequest('Invalid credentials', 'Wrong code')
			if (code.account !== req.body?.account)
				throw new UserBadRequest(
					'Invalid credentials',
					'You tried to change the account now your banned forever',
				)

			const hash = GenerateAuth({
				content: { pwd: req.body?.newPwd, account: code.account },
			})

			res.cookie(CookiesKeys.pwdChange, hash, cookiesConfig.code)
			res.clearCookie(CookiesKeys.confirmPwdChange)
			return true
		},
	},
}

export default Controller
