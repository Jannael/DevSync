import type { Response } from 'supertest'

export type ISuitErrorCasesResponse = {
	name: string
	fn: () => Promise<Response>
	error: {
		code: number
		success: boolean
		msg: string
		description: string
	}
}[]
