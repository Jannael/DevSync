import { UserBadRequest } from '../../error/error'
import { Request, Response } from 'express'
import model from './../../model/group/model'
import { IGroup } from '../../interface/group'
import getToken from '../../utils/token'
import dotenv from 'dotenv'
import { IEnv } from '../../interface/env'
import userModel from '../../model/user/model'
import validator from '../../validator/validator'

dotenv.config({ quiet: true })
const {
  JWT_ACCESS_TOKEN_ENV,
  CRYPTO_ACCESS_TOKEN_ENV
} = process.env as Pick<IEnv,
'JWT_ACCESS_TOKEN_ENV' |
'CRYPTO_ACCESS_TOKEN_ENV'
>

const functions = {
  get: async function (req: Request, res: Response): Promise<IGroup> {
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the group you want')
    return await model.get(req.body?._id)
  },
  create: async function (req: Request, res: Response): Promise<IGroup> {
    // body = name, color, repository?, member?: [{ account, role }], techLead: [account]
    const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV) // techLead
    if (req.body?.name === undefined || req.body?.color === undefined) {
      throw new UserBadRequest('Missing data', 'You need to send at least the name and color for the group you want to create')
    }

    const member: Array<{ account: string, fullName: string, role: string }> = []
    if (req.body?.member !== undefined &&
      Array.isArray(req.body?.member)) {
      for (const { account, role } of req.body?.member) {
        if (account === undefined || role === undefined) continue
        const user = await userModel.get(account, { fullName: 1 })
        member.push({ account, fullName: user.fullName, role })
      }
    }

    const techLead: Array<{ account: string, fullName: string }> = []
    if (req.body?.techLead !== undefined &&
      Array.isArray(req.body?.techLead)) {
      for (const account of req.body?.techLead) {
        if (account === undefined) continue
        const user = await userModel.get(account, { fullName: 1 })
        techLead.push({ account, fullName: user.fullName })
      }
    }

    const groupData = {
      name: req.body?.name,
      color: req.body?.color,
      repository: req.body?.repository ?? undefined,
      member,
      techLead
    }

    validator.group.create(groupData)

    return await model.create(groupData,
      { fullName: accessToken.fullName, account: accessToken.account })
  },
  update: async function (req: Request, res: Response): Promise<IGroup> {
    // _id, data: { name?, color?, repository? }
    const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV) // it must be techLead
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the group you want to update')
    if (req.body?.data.techLead !== undefined || req.body?.data.member !== undefined) throw new UserBadRequest('Invalid credentials', 'You only can update the name, color and repository')

    validator.group.partial(req.body?.data)
    await model.exists(req.body?._id, accessToken.account)
    return await model.update(req.body?._id, req.body?.data)
  },
  delete: async function (req: Request, res: Response): Promise<boolean> {
    const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV) // it must be techLead
    if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the group you want to delete')
    return await model.delete(accessToken.account, req.body?._id)
  },
  member: {
    remove: async function (req: Request, res: Response): Promise<boolean> {
      const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV) // it must be techLead
      if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id of the group to remove the user')
      if (req.body?.account === undefined) throw new UserBadRequest('Missing data', 'You need to send the account of the member you want to remove')
      await model.exists(req.body?._id, accessToken.account)
      return await model.member.remove(req.body?._id, req.body?.account)
    },
    update: {
      role: async function (req: Request, res: Response): Promise<boolean> {
        // body = _idGroup, role, account
        const accessToken = getToken(req, 'accessToken', JWT_ACCESS_TOKEN_ENV, CRYPTO_ACCESS_TOKEN_ENV)
        if (req.body?._id === undefined) throw new UserBadRequest('Missing data', 'You need to send the _id for the group')
        if (req.body?.role === undefined) throw new UserBadRequest('Missing data', 'You need to send the role for the user')
        validator.group.role(req.body?.role)
        if (req.body?.account === undefined) throw new UserBadRequest('Missing data', 'You need to send the account for the user you want to change the role')

        const { _id, role, account } = req.body
        await model.exists(_id, accessToken.account)
        const { fullName } = await userModel.get(account, { fullName: 1 })

        await model.member.remove(_id, account)
        return await model.member.add(_id, { role, account, fullName })
      }
    }
  }
}

export default functions
