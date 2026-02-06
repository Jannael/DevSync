import JwtConfig from '../config/Jwt.config'
import { env } from '../Env.validator'
import type { IRefreshToken } from '../interface/User'
import EncryptToken from './EncryptToken.utils'

const {
	JWT_AUTH_ENV,
	JWT_ACCESS_TOKEN_ENV,
	JWT_REFRESH_TOKEN_ENV,
	CRYPTO_AUTH_ENV,
	CRYPTO_ACCESS_TOKEN_ENV,
	CRYPTO_REFRESH_TOKEN_ENV,
} = env

export function GenerateAuth({
	content,
}: {
	content: Record<string, unknown>
}) {
	return EncryptToken({
		text: content,
		key: CRYPTO_AUTH_ENV,
		jwtPwd: JWT_AUTH_ENV,
		options: JwtConfig.auth,
	})
}

export function GenerateAccessToken({ content }: { content: IRefreshToken }) {
	return EncryptToken({
		text: content,
		key: CRYPTO_ACCESS_TOKEN_ENV,
		jwtPwd: JWT_ACCESS_TOKEN_ENV,
		options: JwtConfig.accessToken,
	})
}

export function GenerateRefreshToken({ content }: { content: IRefreshToken }) {
	return EncryptToken({
		text: content,
		key: CRYPTO_REFRESH_TOKEN_ENV,
		jwtPwd: JWT_REFRESH_TOKEN_ENV,
		options: JwtConfig.refreshToken,
	})
}
