import dotenv from 'dotenv'
import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import type { CustomError } from '../error/Error.constructor'
import ErrorHandler from '../error/Error.handler'
import { Forbidden, UserBadRequest } from '../error/Error.instances'
import type { IEnv } from '../interface/Env'
import type { IRole } from '../interface/Role'
import memberModel from '../model/Member.model'
import getToken from '../utils/auth/GetToken.utils'

dotenv.config({ quiet: true })

const { JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV } =
	process.env as unknown as IEnv

const AuthMiddleware = (roles: Array<IRole>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const accessToken = getToken({
				req,
				tokenName: 'accessToken',
				jwtPwd: JWT_ACCESS_TOKEN_ENV,
				cryptoPwd: CRYPTO_ACCESS_TOKEN_ENV,
			})

			req.body.accessToken = accessToken

			const { groupId } = req.body
			if (groupId === undefined)
				throw new UserBadRequest(
					'Missing data',
					'You need to provide a groupId',
				)
			if (!Types.ObjectId.isValid(groupId))
				throw new UserBadRequest(
					'Invalid credentials',
					'The groupId is invalid',
				)

			const memberRole = await memberModel.GetRole({
				groupId,
				account: accessToken.account,
			})

			if (memberRole === null)
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

export default AuthMiddleware
