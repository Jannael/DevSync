import crypto from 'node:crypto'
import dotenv from 'dotenv'
import type { IEnv } from '../interface/Env'

dotenv.config({ quiet: true })
const { TEST_PWD_ENV } = process.env as Pick<
	IEnv,
	'EMAIL_ENV' | 'PASSWORD_ENV' | 'TEST_PWD_ENV'
>

export function GenerateCode({ testPwd }: { testPwd?: string }): string {
	if (testPwd === TEST_PWD_ENV) {
		return '1234'
	}
	const number = crypto.randomInt(0, 1000000)
	return number.toString().padStart(6, '0')
}

export default GenerateCode
