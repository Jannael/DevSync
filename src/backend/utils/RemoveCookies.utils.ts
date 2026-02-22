import type { Response } from 'express'
import { config } from '../config/Cookie.config'
import type CookiesKeys from '../constant/Cookie.constant'

function RemoveCookies({
	keys,
	res,
}: {
	keys: Array<keyof typeof CookiesKeys>
	res: Response
}) {
	for (const key of keys) {
		res.clearCookie(key, config)
	}
}

export default RemoveCookies
