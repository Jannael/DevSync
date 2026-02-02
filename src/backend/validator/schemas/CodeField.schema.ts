import z from 'zod'

const CodeFieldSchema = z
	.object({
		language: z
			.string()
			.min(1, 'language is required')
			.max(100, 'language must be at most 100 characters'),
		content: z.string().min(1, 'content is required'),
	})
	.nullable()

export default CodeFieldSchema
