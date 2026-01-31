import type { CustomError } from '../../error/error'
import errorHandler from '../../error/handler'

function CreateModel<T, R>({
	Model,
	DefaultError,
}: {
	Model: (params: T) => Promise<R>
	DefaultError: CustomError
}) {
	return async (params: T): Promise<R | undefined> => {
		try {
			return await Model(params)
		} catch (e) {
			errorHandler.allErrors(e as CustomError, DefaultError)
		}
	}
}

export default CreateModel
