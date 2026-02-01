import type { Request } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { UserBadRequest } from '../error/error'
import Decrypt from './Decrypt.utils'

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
		throw new UserBadRequest('Invalid credentials', `Invalid ${tokenName}`)
	return token
}

export default GetToken
