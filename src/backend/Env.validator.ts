import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ quiet: true })

const envSchema = z.object({
	// Server
	PORT: z.string().default('3000'),
	HOST: z.string().default('localhost'),

	// Database
	DB_URL_ENV: z.string().min(1),

	// JWT passwords
	JWT_ACCESS_TOKEN_ENV: z.string().min(1),
	JWT_REFRESH_TOKEN_ENV: z.string().min(1),
	JWT_DATABASE_ENV: z.string().min(1),
	JWT_AUTH_ENV: z.string().min(1),

	// Message encryption
	CRYPTO_ACCESS_TOKEN_ENV: z.string().min(1),
	CRYPTO_REFRESH_TOKEN_ENV: z.string().min(1),
	CRYPTO_DATABASE_ENV: z.string().min(1),
	CRYPTO_AUTH_ENV: z.string().min(1),

	// Email
	EMAIL_ENV: z.string().min(1),
	PASSWORD_ENV: z.string().min(1),

	// Password hash
	BCRYPT_SALT_HASH: z.string().min(1),

	// Test (optional for production, but good to have in schema if used)
	DB_URL_ENV_TEST: z.string().optional(),
})

export const env = envSchema.parse(process.env)
