import { z } from 'zod'
import CreateValidator from '../../utils/helper/CreateValidator.helper'

const PasswordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.max(20, 'Password cannot exceed 20 characters')
	.refine((value) => /[A-Z]/.test(value), {
		message: 'Must include at least one uppercase letter',
	})
	.refine((value) => /[a-z]/.test(value), {
		message: 'Must include at least one lowercase letter',
	})
	.refine((value) => /[0-9]/.test(value), {
		message: 'Must include at least one number',
	})
	.refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
		message: 'Must include at least one special character',
	})

export const PasswordValidator = CreateValidator(
	z.object({ password: PasswordSchema }),
)

export default PasswordSchema
