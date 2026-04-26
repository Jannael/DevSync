import { CreateError } from '@/error/error-constructor'

type INotFound =
  | 'DEVSYNC.json not found'
  | 'Template DEVSYNC.json not found'
  | 'Portfolio workspace not found'
  | 'README target not found'
  | 'LinkedIn markdown target not found'
  | 'CV target not found'
  | 'GitHub repository not found'
  | 'Workflow file not found'
export const NotFound = CreateError<INotFound>('NotFound')

type IForbidden =
  | 'Permission denied to read DEVSYNC.json'
  | 'Permission denied to write output files'
  | 'Permission denied for git operation'
  | 'Permission denied for workflow update'
  | 'Access denied to repository'
export const Forbidden = CreateError<IForbidden>('Forbidden')

type IConflict =
  | 'DEVSYNC.json already exists in current directory'
  | 'Output file already exists'
  | 'Uncommitted changes detected'
  | 'Merge conflict while updating generated files'
  | 'Workflow conflict detected'
export const Conflict = CreateError<IConflict>('Conflict')

type IServerError =
  | 'Failed to read DEVSYNC.json'
  | 'Failed to parse DEVSYNC.json'
  | 'Failed to write generated files'
  | 'Build command failed'
  | 'Update command failed'
  | 'Git operation failed'
  | 'Workflow execution failed'
  | 'Unexpected execution error'
export const ServerError = CreateError<IServerError>('ServerError')

type IBadRequest =
  | 'Invalid command'
  | 'Invalid DEVSYNC.json structure'
  | 'Missing required profile field'
  | 'Invalid social media URL'
  | 'Invalid date format'
  | 'No generation targets selected'
  | 'Invalid repository configuration'
export const BadRequest = CreateError<IBadRequest>('BadRequest')
