import { z } from 'zod'

export function AccountValidator({ account }: { account: string }): boolean {
	return z.string('Invalid email').email('Invalid email').safeParse(account)
		.success
}

export default AccountValidator
