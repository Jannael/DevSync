import express from 'express'
import cookiePaser from 'cookie-parser'

export async function createApp (): Promise<express.Express> {
  const app = express()
  app.use(express.json())
  app.use(cookiePaser())

  return app
}
