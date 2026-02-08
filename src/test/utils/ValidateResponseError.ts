import type { ISuitErrorCasesResponse } from '../interface/SuitErrorCasesResponse'

function ValidateResponseError({
	cases,
	link,
}: {
	cases: ISuitErrorCasesResponse
	link: { rel: string; href: string }[]
}) {
	for (const testCase of cases) {
		test(testCase.name, async () => {
			const res = await testCase.fn()

			expect(res.statusCode).toStrictEqual(testCase.error.code)
			expect(res.body.success).toStrictEqual(testCase.error.success)
			expect(res.body.msg).toStrictEqual(testCase.error.msg)
			expect(res.body.description).toStrictEqual(testCase.error.description)
			expect(res.body.link).toStrictEqual(link)
		})
	}
}

export default ValidateResponseError
