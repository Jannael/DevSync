export type CustomError = Error & {
	code: number
	description?: string
	link?: Array<{ rel: string; href: string }>
}

export function CreateError<T extends string>(
	code: number,
	name: string,
): new (
	message: T,
	description?: string,
	link?: Array<{ rel: string; href: string }>,
) => CustomError {
	const capitalize = (text: string): string =>
		text.charAt(0).toUpperCase() + text.slice(1)

	return class extends Error {
		readonly code: number
		readonly description?: string
		readonly link?: Array<{ rel: string; href: string }>

		constructor(
			message: T,
			description?: string,
			link?: Array<{ rel: string; href: string }>,
		) {
			super(capitalize(message))
			this.name = name
			this.code = code
			this.description =
				description !== undefined ? capitalize(description) : undefined
			this.link = link
		}
	}
}
