import crypto from 'node:crypto'

export function GenerateCode(): string {
	const number = crypto.randomInt(0, 1000000)
	return number.toString().padStart(6, '0')
}

export default GenerateCode
