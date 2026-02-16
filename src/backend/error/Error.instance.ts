import { CreateError } from './Error.constructor'

type IDatabaseError =
	| 'Connection error'
	| 'Failed to save'
	| 'Failed to remove'
	| 'Failed to access data'
export const DatabaseError = CreateError<IDatabaseError>(500, 'databaseError')

type IUserBadRequest = 'Missing data' | 'Invalid credentials'
export const UserBadRequest = CreateError<IUserBadRequest>(
	400,
	'userBadRequest',
)

type IDuplicateData = 'User already exists' | 'Invitation already exists'
export const DuplicateData = CreateError<IDuplicateData>(409, 'duplicateData')

type INotFound =
	| 'User not found'
	| 'Group not found'
	| 'Invitation not found'
	| 'Task not found'
	| 'Solution not found'
export const NotFound = CreateError<INotFound>(404, 'NotFound')

type IServerError = 'Operation Failed'
export const ServerError = CreateError<IServerError>(500, 'ServerError')

type IForbidden = 'Invalid account' | 'Access denied'
export const Forbidden = CreateError<IForbidden>(403, 'Forbidden')

type IInvalidToken = 'access token is invalid' | 'refresh token is invalid'
export const InvalidToken = CreateError<IInvalidToken>(401, 'InvalidToken')
