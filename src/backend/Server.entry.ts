import { CreateApp, environments } from './CreateApp'
import { env } from './Env.validator'

const PORT = env.PORT
const DbUrl = env.DB_URL_ENV

async function init(PORT: string): Promise<void> {
	const app = await CreateApp({ DbUrl, environment: environments.production })
	app.listen(PORT, () => console.log(`server at PORT: ${PORT}`))
}

init(PORT).catch((e) => console.error('something went wrong : ', e))
