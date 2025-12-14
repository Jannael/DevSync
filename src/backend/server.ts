import { env } from './env'
import { createApp } from './app'

const PORT = env.PORT
const dbUrl = env.DB_URL_ENV

async function init (PORT: string): Promise<void> {
  const app = await createApp(dbUrl, 'production')
  app.listen(PORT, () => console.log('server at PORT: ' + PORT))
}

init(PORT)
  .catch(e => console.error('something went wrong : ', e))
