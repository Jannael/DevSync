import dotenv from 'dotenv'
import type { Request } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import CookiesKeys from '../constant/Cookies.constant'
import { UserBadRequest } from '../error/Error.instances'
import type { IEnv } from '../interface/Env'
import Decrypt from './DecryptToken.utils'

dotenv.config({ quiet: true })
const {
	JWT_ACCESS_TOKEN_ENV,
	JWT_REFRESH_TOKEN_ENV,
	JWT_AUTH_ENV,
	CRYPTO_ACCESS_TOKEN_ENV,
	CRYPTO_REFRESH_TOKEN_ENV,
	CRYPTO_AUTH_ENV,
} = process.env as unknown as IEnv

function GetToken({
	req,
	tokenName,
	jwtPwd,
	cryptoPwd,
}: {
	req: Request
	tokenName: string
	jwtPwd: string
	cryptoPwd: string
}): JwtPayload {
	if (req.cookies[tokenName] === undefined)
		throw new UserBadRequest('Missing data', `Missing token = ${tokenName}`)

	const jwtToken = Decrypt({
		encryptedText: req.cookies[tokenName],
		key: cryptoPwd,
		tokenName,
	})

	const token = jwt.verify(jwtToken, jwtPwd)
	if (typeof token === 'string')
		throw new UserBadRequest(
			'Invalid credentials',
			`Invalid token = ${tokenName}`,
		)
	return token
}

export function GetRefreshToken({ req }: { req: Request }) {
	return GetToken({
		req,
		tokenName: CookiesKeys.refreshToken,
		jwtPwd: JWT_REFRESH_TOKEN_ENV,
		cryptoPwd: CRYPTO_REFRESH_TOKEN_ENV,
	})
}

export function GetAccessToken({ req }: { req: Request }) {
	return GetToken({
		req,
		tokenName: CookiesKeys.accessToken,
		jwtPwd: JWT_ACCESS_TOKEN_ENV,
		cryptoPwd: CRYPTO_ACCESS_TOKEN_ENV,
	})
}

export function GetAuth({
	req,
	tokenName,
}: {
	req: Request
	tokenName: string
}) {
	return GetToken({
		req,
		tokenName: tokenName,
		jwtPwd: JWT_AUTH_ENV,
		cryptoPwd: CRYPTO_AUTH_ENV,
	})
}
