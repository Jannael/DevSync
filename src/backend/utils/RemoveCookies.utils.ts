import type { Response } from 'express'
import type CookiesKeys from '../constant/Cookies.constant'

function RemoveCookies({
	keys,
	res,
}: {
	keys: Array<keyof typeof CookiesKeys>
	res: Response
}) {
	for (const key of keys) {
		res.clearCookie(key)
	}
}

export default RemoveCookies
