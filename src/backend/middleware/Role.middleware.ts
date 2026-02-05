import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import type { CustomError } from '../error/Error.constructor'
import ErrorHandler from '../error/Error.handler'
import { Forbidden, UserBadRequest } from '../error/Error.instance'
import type { IRole } from '../interface/Role'
import memberModel from '../model/Member.model'
import { GetAccessToken } from '../secret/GetToken'

// 1.groupId is validated and exists
// 2.role is validated
// 3.accessToken at req.body.accessToken
// 4.memberRole at req.body.role

// !IMPORTANT:
// do not use the field 'role': use 'newRole' or 'memberRole' instead

const RoleMiddleware = (roles: Array<IRole>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = GetAccessToken({ req })

			req.body.accessToken = accessToken

			const { groupId } = req.body
			if (groupId === undefined)
				throw new UserBadRequest('Missing data', 'Missing group id')
			if (!Types.ObjectId.isValid(groupId))
				throw new UserBadRequest('Invalid credentials', 'Invalid group id')

			const memberRole = await memberModel.GetRole({
				groupId,
				account: accessToken.account,
			})

			if (!memberRole)
				throw new Forbidden('Access denied', 'You do not belong to the group')

			if (!roles.includes(memberRole as IRole))
				throw new Forbidden(
					'Access denied',
					'You do not have the required role',
				)

			req.body.role = memberRole
			next()
		} catch (e) {
			ErrorHandler.Response(res, e as CustomError)
		}
	}
}

export default RoleMiddleware
