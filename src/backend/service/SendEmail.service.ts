import nodemailer from 'nodemailer'
import { env } from '../Env.validator'
import { ServerError } from '../error/Error.instance'

const { EMAIL_ENV, PASSWORD_ENV } = env

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
