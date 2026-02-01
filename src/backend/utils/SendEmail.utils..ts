import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import { ServerError } from '../error/error'
import type { IEnv } from '../interface/Env'

dotenv.config({ quiet: true })
const { EMAIL_ENV, PASSWORD_ENV } = process.env as Pick<
	IEnv,
	'EMAIL_ENV' | 'PASSWORD_ENV' | 'TEST_PWD_ENV'
>

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL_ENV,
		pass: PASSWORD_ENV,
	},
})

export async function SendEmail({
	account,
	code,
	msg,
}: {
	account: string
	code: string
	msg?: string
}): Promise<boolean> {
	try {
		await transporter.sendMail({
			from: EMAIL_ENV,
			to: account,
			subject: 'Verify your email',
			text: msg ?? `Your verification code is ${code}`,
		})
		return true
	} catch {
		throw new ServerError(
			'Operation Failed',
			'Something went wrong while sending emails',
		)
	}
}

export default SendEmail
