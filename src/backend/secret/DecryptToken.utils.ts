import crypto from 'node:crypto'
import { UserBadRequest } from '../error/Error.instance'

export function DecryptToken({
	encryptedText,
	key,
	tokenName,
}: {
	encryptedText: string
	key: string
	tokenName: string
}): string {
	try {
		const [ivHex, encrypted] = encryptedText.split(':')
		const iv = Buffer.from(ivHex, 'hex')
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Buffer.from(key, 'base64'),
			iv,
		)
		let decrypted = decipher.update(encrypted, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return decrypted
	} catch (error) {
		const e = error as Error
		if (
			e.name === 'TypeError' &&
			e.message === 'Invalid initialization vector'
		) {
			throw new UserBadRequest(
				'Invalid credentials',
				`The ${tokenName} is invalid`,
			)
		}
		return ''
	}
}
export default DecryptToken
