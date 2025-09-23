import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })
const { EMAIL_ENV, PASSWORD_ENV } = process.env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ENV as string,
    pass: PASSWORD_ENV as string
  }
})

export function verifyEmail (email: string): boolean {
  const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!rgx.test(email)) {
    return false
  }
  return true
}

export function generateCode (): number {
  return Number((Math.floor(Math.random() * 10000).toString().padEnd(6, '0')))
}

export async function sendEmail (email: string, code: number, msg?: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_ENV as string,
      to: email,
      subject: 'Verify your email',
      text: msg ?? `Your verification code is ${code}`
    })
    return true
  } catch (e) {
    return false
  }
}
