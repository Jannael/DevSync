import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import cookiesConfig from '../config/Cookie.config'
import ProjectionConfig from '../config/Projection.config'
import CookiesKeys from '../constant/Cookie.constant'
import { NotFound, ServerError, UserBadRequest } from '../error/Error.instances'
import type { IEnv } from '../interface/Env'
import type { IRefreshToken, IUser } from '../interface/User'
import AuthModel from '../model/Auth.model'
import UserModel from '../model/User.model'
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
import { PasswordValidator } from '../validator/schemas/Password.schema'

dotenv.config({ quiet: true })
const { JWT_REFRESH_TOKEN_ENV, CRYPTO_REFRESH_TOKEN_ENV } =
	process.env as unknown as IEnv

const Controller = {
	request: {
		Code: async (req: Request, res: Response): Promise<boolean> => {
			// body = { account, TEST_PWD }
			const { account, TEST_PWD } = req.body
			if (!account) throw new UserBadRequest('Missing data', 'Missing account')
			if (!AccountValidator(account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')
			const code = GenerateCode(TEST_PWD)

			if (!TEST_PWD) await SendEmail({ account, code })
			const jwtEncrypt = GenerateAuth({ content: { code, account } })

			res.cookie(CookiesKeys.code, jwtEncrypt, cookiesConfig['5m'])
			return true
		},
		AccessToken: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { refreshToken }
			if (!req.cookies.refreshToken)
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

			const accessToken = GenerateAccessToken({ content: refreshToken } as {
				content: IRefreshToken
			})

			res.cookie(
				CookiesKeys.accessToken,
				accessToken,
				cookiesConfig.accessToken,
			)

			return true
		},
		Logout: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { refreshToken }
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
	VerifyCode: async (req: Request, res: Response): Promise<boolean> => {
		// body = { code }
		if (!req.body.code) throw new UserBadRequest('Missing data', 'Missing code')

		const decodedCode = GetAuth({
			req,
			tokenName: CookiesKeys.code,
		})

		if (req.body.code !== decodedCode.code)
			throw new UserBadRequest('Invalid credentials', 'Wrong code')

		const encrypted = GenerateAuth({
			content: { account: decodedCode.account },
		})

		res.cookie(CookiesKeys.account, encrypted, cookiesConfig['5m'])
		res.clearCookie(CookiesKeys.code)

		return true
	},
	Account: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			// body = { newAccount, TEST_PWD }
			const { newAccount, TEST_PWD } = req.body
			if (newAccount === undefined)
				throw new UserBadRequest('Missing data', 'Missing new account')
			if (!AccountValidator(newAccount))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const accessToken = GetAccessToken({ req })
			const code = GenerateCode(TEST_PWD)
			const codeNewAccount = GenerateCode(TEST_PWD)

			if (!req.body.TEST_PWD) {
				await SendEmail({ account: accessToken.account, code })
				await SendEmail({ account: newAccount, code: codeNewAccount })
			}

			if (accessToken.account === newAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'The new account can not be the same as the current one',
				)

			const codeEncrypted = GenerateAuth({ content: { code } })

			const codeNewAccountEncrypted = GenerateAuth({
				content: { code: codeNewAccount, account: newAccount },
			})

			res.cookie(
				CookiesKeys.codeCurrentAccount,
				codeEncrypted,
				cookiesConfig['10m'],
			)
			res.cookie(
				CookiesKeys.codeNewAccount,
				codeNewAccountEncrypted,
				cookiesConfig['10m'],
			)
			return true
		},
		Change: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { codeCurrentAccount, codeNewAccount }
			const { codeCurrentAccount, codeNewAccount } = req.body
			if (!codeCurrentAccount || !codeNewAccount)
				throw new UserBadRequest(
					'Missing data',
					'Missing code new account or code current account',
				)

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.codeCurrentAccount,
			})
			const cookieNewAccount = GetAuth({
				req,
				tokenName: CookiesKeys.codeNewAccount,
			})

			if (code.code !== codeCurrentAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid current account code',
				)
			if (cookieNewAccount.code !== codeNewAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid new account code',
				)

			const user: IUser | undefined = await UserModel.Get({
				account: code.account,
				projection: { ...ProjectionConfig.IRefreshToken },
			})
			if (!user) throw new NotFound('User not found')

			const result = await UserModel.Update({
				_id: user._id,
				data: { account: cookieNewAccount.account },
			})
			if (!result)
				throw new ServerError('Operation Failed', 'The account was not updated')

			const accessToken = GenerateAccessToken({ content: user })
			const refreshToken = GenerateRefreshToken({ content: user })

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
			res.clearCookie(CookiesKeys.codeCurrentAccount)
			res.clearCookie(CookiesKeys.codeNewAccount)

			return true
		},
	},
	Pwd: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			// body = { account, TEST_PWD }
			const { account, TEST_PWD } = req.body
			if (!account) throw new UserBadRequest('Missing data', 'Missing account')
			if (!AccountValidator(account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const dbValidation = await AuthModel.Exists({ account })
			if (!dbValidation) throw new NotFound('User not found')

			const code = GenerateCode(TEST_PWD)
			if (!TEST_PWD) await SendEmail({ account, code })

			const hashCode = GenerateAuth({ content: { code, account } })

			res.cookie(CookiesKeys.pwdChange, hashCode, cookiesConfig['5m'])
			return true
		},
		Change: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { pwdChange }
			// body = { code, newPwd }
			const { code, newPwd } = req.body
			if (!code || !newPwd)
				throw new UserBadRequest('Missing data', 'Missing code or new password')
			const validPwd = PasswordValidator({ password: newPwd })

			const cookieCode = GetAuth({
				req,
				tokenName: CookiesKeys.pwdChange,
			})
			if (cookieCode.code !== code)
				throw new UserBadRequest('Invalid credentials', 'Invalid code')

			const user = await UserModel.Get({
				account: cookieCode.account,
				projection: ProjectionConfig.IRefreshToken,
			})
			if (!user || !user._id) throw new NotFound('User not found')

			const savedInDB = await UserModel.Update({
				data: { pwd: validPwd.password },
				_id: user._id,
			})
			if (!savedInDB)
				throw new ServerError(
					'Operation Failed',
					'The password was not updated',
				)

			const refreshToken = GenerateRefreshToken({
				content: user,
			})
			const accessToken = GenerateAccessToken({
				content: user,
			})

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
			res.clearCookie(CookiesKeys.confirmPwdChange)
			return true
		},
	},
	RefreshToken: {
		Code: async (req: Request, res: Response): Promise<boolean> => {
			// body = { account, pwd, TEST_PWD }
			const { account, pwd, TEST_PWD } = req.body
			if (!account || !pwd)
				throw new UserBadRequest('Missing data', 'Missing account or password')
			if (!AccountValidator(account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const code = GenerateCode(TEST_PWD)
			const user = await AuthModel.Login({ account, pwd })

			if (!user)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid account or password',
				)

			if (!TEST_PWD) await SendEmail({ account, code })

			const token = GenerateAuth({ content: user })
			const hashCode = GenerateAuth({ content: { code } })

			res.cookie(CookiesKeys.genericToken, token, cookiesConfig['5m'])
			res.cookie(
				CookiesKeys.refreshTokenRequestCode,
				hashCode,
				cookiesConfig['5m'],
			)

			return true
		},
		Confirm: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { genericToken, refreshTokenRequestCode }
			// body = { code }
			const { code } = req.body
			if (!code) throw new UserBadRequest('Missing data', 'Missing code')

			const cookieCode = GetAuth({
				req,
				tokenName: CookiesKeys.refreshTokenRequestCode,
			})
			const user = GetAuth({
				req,
				tokenName: CookiesKeys.genericToken,
			}) as IRefreshToken

			if (cookieCode.code !== code)
				throw new UserBadRequest('Invalid credentials', 'Invalid code')

			delete (user as JwtPayload).iat
			delete (user as JwtPayload).exp

			const refreshToken = GenerateRefreshToken({ content: user })
			const accessToken = GenerateAccessToken({ content: user })

			const savedInDB = await AuthModel.RefreshToken.Save({
				token: refreshToken,
				userId: user._id,
			})

			if (!savedInDB)
				throw new ServerError(
					'Operation Failed',
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
}

export default Controller
