import dotenv from 'dotenv'
import type { Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import cookiesConfig from '../config/Cookies.config'
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

dotenv.config({ quiet: true })
const { JWT_REFRESH_TOKEN_ENV, CRYPTO_REFRESH_TOKEN_ENV } =
	process.env as unknown as IEnv

const Controller = {
	request: {
		Code: async (req: Request, res: Response): Promise<boolean> => {
			// body = { account, TEST_PWD }
			if (req.body.account === undefined)
				throw new UserBadRequest('Missing data', 'Missing account')
			if (!AccountValidator(req.body.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')
			const code = GenerateCode(req.body.TEST_PWD)

			if (!req.body.TEST_PWD)
				await SendEmail({ account: req.body.account, code })

			const jwtEncrypt = GenerateAuth({
				content: { code, account: req.body.account },
			})

			res.cookie(CookiesKeys.code, jwtEncrypt, cookiesConfig.code)
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

		res.clearCookie('code')

		const encrypted = GenerateAuth({
			content: { account: decodedCode.account },
		})

		res.cookie(CookiesKeys.account, encrypted, cookiesConfig.code)
		return true
	},
	Account: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			// body = { newAccount, TEST_PWD }
			if (req.body.newAccount === undefined)
				throw new UserBadRequest('Missing data', 'Missing new account')
			if (!AccountValidator(req.body.newAccount))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const accessToken = GetAccessToken({ req })
			const code = GenerateCode(req.body.TEST_PWD)
			const codeNewAccount = GenerateCode(req.body.TEST_PWD)

			if (!req.body.TEST_PWD) {
				await SendEmail({ account: accessToken.account, code })
				await SendEmail({
					account: req.body.newAccount,
					code: codeNewAccount,
				})
			}

			if (accessToken.account === req.body.newAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'The new account can not be the same as the current one',
				)

			const codeEncrypted = GenerateAuth({ content: { code } })

			const codeNewAccountEncrypted = GenerateAuth({
				content: { code: codeNewAccount, account: req.body.newAccount },
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
		Change: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { codeCurrentAccount, codeNewAccount }
			if (!req.body.codeCurrentAccount || !req.body.codeNewAccount)
				throw new UserBadRequest(
					'Missing data',
					'Missing codeNewAccount or codeCurrentAccount',
				)

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.codeCurrentAccount,
			})
			const codeNewAccount = GetAuth({
				req,
				tokenName: CookiesKeys.codeNewAccount,
			})

			if (code.code !== req.body.codeCurrentAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid current account code',
				)
			if (codeNewAccount.code !== req.body.codeNewAccount)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid new account code',
				)

			const user: IUser | undefined = await UserModel.Get({
				account: code.account,
				projection: { ...ProjectionConfig.IRefreshToken },
			})
			if (!user) throw new NotFound('User not found')

			const result = await UserModel.AccountUpdate({
				_id: user._id,
				account: codeNewAccount.account,
			})
			if (!result)
				throw new ServerError('Operation Failed', 'The account was not updated')

			const accessToken = GenerateAccessToken({
				content: { ...user },
			})
			const refreshToken = GenerateRefreshToken({
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
			res.clearCookie(CookiesKeys.codeCurrentAccount)
			res.clearCookie(CookiesKeys.codeNewAccount)

			return true
		},
	},
	Pwd: {
		RequestCode: async (req: Request, res: Response): Promise<boolean> => {
			// body = { account, TEST_PWD }
			if (!req.body.account)
				throw new UserBadRequest('Missing data', 'Missing account')

			if (!AccountValidator(req.body.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const dbValidation = await AuthModel.Exists({
				account: req.body.account,
			})

			if (!dbValidation) throw new NotFound('User not found')

			const code = GenerateCode(req.body.TEST_PWD)

			if (!req.body.TEST_PWD)
				await SendEmail({ account: req.body.account, code })

			const hashCode = GenerateAuth({
				content: { code, account: req.body.account },
			})

			res.cookie(CookiesKeys.pwdChange, hashCode, cookiesConfig.code)
			return true
		},
		Change: async (req: Request, res: Response): Promise<boolean> => {
			// cookies = { pwdChange }
			// body = { code, newPwd }
			if (!req.body.code || !req.body.newPwd)
				throw new UserBadRequest('Missing data', 'Missing code or newPwd')

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.pwdChange,
			})
			if (code.code !== req.body.code)
				throw new UserBadRequest('Invalid credentials', 'Invalid code')

			const user = await UserModel.Get({
				account: code.account,
				projection: { ...ProjectionConfig.IRefreshToken },
			})
			if (!user || !user._id) throw new NotFound('User not found')

			const savedInDB = await UserModel.Update({
				data: { pwd: req.body.newPwd },
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
			if (!req.body.account || !req.body.pwd)
				throw new UserBadRequest('Missing data', 'Missing account or password')
			if (!AccountValidator(req.body.account))
				throw new UserBadRequest('Invalid credentials', 'Invalid account')

			const code = GenerateCode(req.body.TEST_PWD)

			const user = await AuthModel.Login({
				account: req.body.account,
				pwd: req.body.pwd,
			})

			if (!user)
				throw new UserBadRequest(
					'Invalid credentials',
					'Invalid account or password',
				)

			if (!req.body.TEST_PWD)
				await SendEmail({ account: req.body.account, code })

			const token = GenerateAuth({
				content: user,
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
			// cookies = { genericToken, refreshTokenRequestCode }
			// body = { code }
			if (!req.body.code)
				throw new UserBadRequest('Missing data', 'Missing code')

			const code = GetAuth({
				req,
				tokenName: CookiesKeys.refreshTokenRequestCode,
			})
			const user = GetAuth({
				req,
				tokenName: CookiesKeys.genericToken,
			})

			if (code.code !== req.body.code)
				throw new UserBadRequest('Invalid credentials', 'Invalid code')

			delete user.iat
			delete user.exp

			const refreshToken = GenerateRefreshToken({ content: user } as {
				content: IRefreshToken
			})

			const accessToken = GenerateAccessToken({ content: user } as {
				content: IRefreshToken
			})

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
