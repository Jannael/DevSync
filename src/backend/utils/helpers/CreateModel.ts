import type { CustomError } from '../../error/error'
import errorHandler from '../../error/handler'

function CreateModel<T>({
	model,
	defaultError,
}: {
	model: (params: T) => Promise<unknown>
	defaultError: CustomError
}) {
	return async (params: T) => {
		try {
			return await model(params)
		} catch (e) {
			errorHandler.allErrors(e as CustomError, defaultError)
		}
	}
}

export default CreateModel
