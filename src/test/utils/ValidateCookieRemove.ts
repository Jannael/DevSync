import type { Response } from 'supertest'

function ValidateCookieRemove({
	cookieObj,
	cookies,
}: {
	cookieObj: Response['header']
	cookies: string[]
}) {
	const setCookies = cookieObj['set-cookie'] as unknown as string[]

	for (const cookie of cookies) {
		const cookieFound = setCookies?.find((cookieStr: string) =>
			cookieStr.startsWith(`${cookie}=;`),
		)

		expect(cookieFound).toBeDefined()
		expect(cookieFound).toContain('GMT')
	}
}

export default ValidateCookieRemove
