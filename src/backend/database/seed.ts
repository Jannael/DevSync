import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })
const { DBURL_ENV } = process.env

async function seed (): Promise<void> {
  await mongoose.connect(DBURL_ENV as string)
}

seed()
  .catch(e => console.error(e))
