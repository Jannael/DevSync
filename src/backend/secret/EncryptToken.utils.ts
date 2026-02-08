import crypto from 'node:crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'

export function EncryptToken({
	text,
	key,
	jwtPwd,
	options,
}: {
	text: Record<string, unknown>
	key: string
	jwtPwd: string
	options: SignOptions
}): string {
	const payload = jwt.sign(text, jwtPwd, options)

	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv(
		'aes-256-cbc',
		Buffer.from(key, 'base64'),
		iv,
	)
	let encrypted = cipher.update(payload, 'utf8', 'hex')
	encrypted += cipher.final('hex')
	const ivHex = iv.toString('hex')
	return `${ivHex}:${encrypted}`
}

export default EncryptToken
