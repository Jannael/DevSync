export const Omit = ({
	obj,
	keys,
}: {
	obj: Record<string, unknown>
	keys: string[]
}): Record<string, unknown> =>
	Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))

export default Omit
