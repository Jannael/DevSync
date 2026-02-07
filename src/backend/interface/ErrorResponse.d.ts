export interface IErrorResponse {
	success: boolean
	code: number
	msg: string
	description?: string
	link?: Array<{ rel: string; href: string }>
}
