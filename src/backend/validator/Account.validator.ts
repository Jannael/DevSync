import z from 'zod'

const AccountSchema = z.string('Invalid email').email('Invalid email')

export function AccountValidator({ account }: { account: string }): boolean {
	try {
		AccountSchema.parse(account)
		return true
	} catch {
		return false
	}
}
export default AccountValidator
