import type { CustomError } from '../../error/Error.constructor'
import ErrorHandler from '../../error/Error.handler'

function CreateModel<T, R>({
	Model,
	DefaultError,
}: {
	Model: (params: T) => Promise<R | undefined>
	DefaultError: CustomError
}) {
	return async (params: T): Promise<R | undefined> => {
		try {
			return await Model(params)
		} catch (e) {
			ErrorHandler.Model({ error: e as CustomError, DefaultError })
		}
	}
}

export default CreateModel
