import type { Response } from 'supertest'

function ValidateCookie({
	cookieObj,
	cookies,
}: {
	cookieObj: Response['header']
	cookies: string[]
}) {
	for (const cookie of cookies) {
		const cookies = cookieObj['set-cookie'] as unknown as string[]

		const cookieFound = cookies?.find((cookieStr: string) =>
			cookieStr.startsWith(`${cookie}=`),
		)

		expect(cookieFound).toBeDefined()
		expect(cookieFound).toContain('HttpOnly')
	}
}

export default ValidateCookie
