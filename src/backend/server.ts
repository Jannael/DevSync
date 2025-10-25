import { createApp } from './app'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const PORT = process.env.PORT as string

async function init (PORT: string): Promise<void> {
  const app = await createApp()
  app.listen(PORT, () => console.log('server at PORT: ' + PORT))
}

init(PORT)
  .catch(e => console.error('something went wrong : ', e))
