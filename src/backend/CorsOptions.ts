import type { CorsOptions as ICorsOptions } from 'cors'
import { env } from './Env.validator'

const HOST = env.HOST
const whitelist = HOST.split(',')

const CorsOptions: ICorsOptions = {
	origin: (origin, cb) => {
		if (origin === undefined || whitelist.includes(origin)) cb(null, true)
		else cb(new Error(`CORS: Origin ${origin} Not allowed`))
	},
	credentials: true,
}

export default CorsOptions
