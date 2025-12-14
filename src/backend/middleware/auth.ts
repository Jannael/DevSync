import { NextFunction, Request, Response } from 'express'
import getToken from '../utils/token'
import { IEnv } from '../interface/env'
import groupModel from '../database/schemas/node/group'
import { CustomError, Forbidden, NotFound, UserBadRequest } from '../error/error'
import dotenv from 'dotenv'
import handler from '../error/handler'
import { Types } from 'mongoose'

dotenv.config({ quiet: true })

const {
  JWT_ACCESS_TOKEN_ENV,
  CRYPTO_ACCESS_TOKEN_ENV
} = process.env as unknown as IEnv

const middleware = (roles: Array<'techLead' | 'developer' | 'documenter'>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV)
      const { groupId } = req.body
      if (groupId === undefined) throw new UserBadRequest('Missing data', 'The groupId is missing')
      if (!Types.ObjectId.isValid(groupId)) throw new UserBadRequest('Invalid credentials', 'The groupId is invalid')
      req.body.accessToken = accessToken

      const group = await groupModel.findOne({ _id: groupId }, { techLead: 1, member: 1 }).lean()
      if (group === null || group.techLead === undefined) throw new NotFound('Group not found', 'The group was not found')

      if (roles.includes('techLead')) {
        const isTechLead = group.techLead.some(t => t.account === accessToken.account)
        if (isTechLead) {
          req.body.role = 'techLead'
          next()
          return
        }
      }

      const member = group.member?.find(m => m.account === accessToken.account)
      if (member === undefined) throw new Forbidden('Access denied', 'You do not belong to the group')
      if (roles.includes(member.role as any)) {
        req.body.role = member.role
        next()
        return
      }

      throw new Forbidden('Access denied', 'You do not have the required role')
    } catch (e) {
      handler.user(res, e as CustomError)
    }
  }
}

export default middleware
