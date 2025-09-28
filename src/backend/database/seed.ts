import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { IEnv } from '../interface/env'

dotenv.config({ quiet: true })
const { DBURL_ENV } = process.env as Pick<IEnv, 'DBURL_ENV'>

async function seed (): Promise<void> {
  await mongoose.connect(DBURL_ENV)
}

seed()
  .catch(e => console.error(e))
