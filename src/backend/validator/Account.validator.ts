export function AccountValidator({ account }: { account: string }): boolean {
	const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!rgx.test(account)) {
		return false
	}
	return true
}
export default AccountValidator
