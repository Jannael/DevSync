import crypto from 'node:crypto'
import { env } from '../../Env.validator'

const { TEST_PWD_ENV } = env

export function GenerateCode(data: { testPwd: string } | null): string {
	if (data?.testPwd === TEST_PWD_ENV) {
		return '1234'
	}
	const number = crypto.randomInt(0, 1000000)
	return number.toString().padStart(6, '0')
}

export default GenerateCode
