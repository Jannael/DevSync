import z from 'zod'

const CodeFieldSchema = z
	.object({
		language: z
			.string('Code.Language is required')
			.min(1, 'Code.Language is required')
			.max(100, 'Code.Language must be at most 100 characters'),
		content: z
			.string('Code.Content is required')
			.min(1, 'Code.Content is required'),
	})
	.nullable()

export default CodeFieldSchema
