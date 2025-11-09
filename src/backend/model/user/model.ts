import { CustomError, DatabaseError, DuplicateData, Forbidden, NotFound, UserBadRequest } from '../../error/error'
import { IEnv } from '../../interface/env'
import { verifyEmail } from '../../utils/utils'
import dbModel from './../../database/schemas/node/user'
import { IRefreshToken, IUser, IUserGroup, IUserInvitation } from './../../interface/user'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { Types } from 'mongoose'
import validator from '../../validator/validator'
import config from '../../config/config'
import errorHandler from '../../error/handler'
import groupModel from '../group/model'

dotenv.config({ quiet: true })
const { BCRYPT_SALT_HASH } = process.env as Pick<IEnv, 'BCRYPT_SALT_HASH'>

const model = {
  create: async function (data: IUser): Promise<IRefreshToken> {
    try {
      if (data._id !== undefined) throw new UserBadRequest('Invalid credentials', 'You can not put the _id yourself')
      if (data.refreshToken !== undefined) throw new UserBadRequest('Invalid credentials', 'You can not put the refreshToken yourself')
      validator.user.create(data)

      const exists = await dbModel.exists({ account: data.account })
      if (exists != null) throw new DuplicateData('User already exists', 'This account belongs to an existing user')

      const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
      const hashedPwd = await bcrypt.hash(data.pwd, salt)
      const payload = { ...data, pwd: hashedPwd }
      const result = await dbModel.insertOne({ ...payload })
      const user = await dbModel.findOne({ _id: result._id },
        config.database.projection.IRefreshToken
      ).lean()

      if (user === null) throw new NotFound('User not found', 'The user appears to be created but it was not found')

      return user
    } catch (e: any) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to save', 'The user was not created, something went wrong please try again')
      )
      throw new DatabaseError('Failed to save', 'The user was not created, something went wrong please try again')
    }
  },
  update: async function (data: Partial<IUser>, userId: Types.ObjectId): Promise<IRefreshToken> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
      }

      if (data.pwd !== undefined) {
        const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
        const pwd = await bcrypt.hash(data.pwd, salt)
        data.pwd = pwd
      }

      if (data.account !== undefined) throw new UserBadRequest('Invalid credentials', 'You can not update the account here')
      if (data._id !== undefined) throw new UserBadRequest('Invalid credentials', 'You can not change the _id')
      if (data.refreshToken !== undefined) throw new UserBadRequest('Invalid credentials', 'You can not update the refreshToken')

      validator.user.partial(data)

      const user = await dbModel.updateOne({ _id: userId }, { ...data })
      if (user.matchedCount === 0) throw new NotFound('User not found')
      const refreshToken = await dbModel.findOne({ _id: userId }, config.database.projection.IRefreshToken).lean()

      if (user.acknowledged && refreshToken !== null) {
        return refreshToken
      }

      throw new NotFound('User not found')
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to save', 'The user was not updated, something went wrong please try again')
      )
      throw new DatabaseError('Failed to save', 'The user was not updated, something went wrong please try again')
    }
  },
  delete: async function (userId: Types.ObjectId): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
      }

      const result = await dbModel.deleteOne({ _id: userId })

      if (result.acknowledged && result.deletedCount === 1) { return true }
      throw new NotFound('User not found')
    } catch (e) {
      errorHandler.allErrors(
        e as CustomError,
        new DatabaseError('Failed to remove', 'The user was not deleted, something went wrong please try again')
      )
      return false
    }
  },
  account: {
    update: async function (userId: Types.ObjectId, account: string): Promise<IRefreshToken> {
      try {
        if (!Types.ObjectId.isValid(userId)) {
          throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
        }

        const isValidAccount = verifyEmail(account)
        if (!isValidAccount) throw new UserBadRequest('Invalid credentials', 'The account must match example@service.ext')

        const newAccountExists = await dbModel.exists({ account })
        if (newAccountExists != null) throw new DuplicateData('User already exists', 'This account belongs to an existing user')

        const response = await dbModel.updateOne({ _id: userId }, { account })
        if (response.matchedCount === 0) throw new NotFound('User not found')

        const user = await dbModel.findOne({ _id: userId }, config.database.projection.IRefreshToken).lean()
        if (user === null) throw new NotFound('User not found')
        return user
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to save', 'The account was not updated, something went wrong please try again')
        )
        throw new DatabaseError('Failed to save', 'The account was not updated, something went wrong please try again')
      }
    }
  },
  password: {
    update: async function (account: string, pwd: string): Promise<boolean> {
      try {
        if (!verifyEmail(account)) throw new UserBadRequest('Invalid credentials', 'The account must match example@service.ext')

        const salt = await bcrypt.genSalt(Number(BCRYPT_SALT_HASH))
        const hashedPwd = await bcrypt.hash(pwd, salt)
        const response = await dbModel.updateOne({ account }, { pwd: hashedPwd })
        if (response.matchedCount === 0) throw new NotFound('User not found')

        return true
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to save', 'The password was not updated, something went wrong please try again')
        )
        return false
      }
    }
  },
  invitation: {
    get: async function (userId: Types.ObjectId): Promise<IUserInvitation[] | undefined | null> {
      try {
        if (!Types.ObjectId.isValid(userId)) {
          throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
        }

        const user = await dbModel.findOne({ _id: userId }, { invitation: 1, _id: 0 }).lean()
        if (user === null) throw new NotFound('User not found')
        return user.invitation
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to access data', 'The invitations were not retrieved, something went wrong please try again')
        )
        return null
      }
    },
    create: async function (account: string, invitation: IUserInvitation): Promise<boolean> {
      try {
        if (!verifyEmail(account)) {
          throw new UserBadRequest('Invalid credentials', 'The account must match example@service.com')
        }

        await groupModel.exists(invitation._id)

        validator.user.invitation.add(invitation)

        const currentInvitation = await dbModel.findOne(
          { account }, { invitation: 1, _id: 0 }
        )

        if (currentInvitation?.invitation?.length !== undefined &&
          currentInvitation?.invitation?.length >= config.user.maxInvitations
        ) {
          throw new Forbidden('Access denied', `The user with the account ${account} has reached the maximum number of invitations`)
        }

        const res = await dbModel.updateOne({ account }, { $push: { invitation } })
        if (res.matchedCount === 0) throw new NotFound('User not found')

        return res.acknowledged
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to save', 'The user was not invited, something went wrong please try again')
        )
        return false
      }
    },
    remove: async function (userId: Types.ObjectId, invitationId: Types.ObjectId): Promise<boolean> {
      try {
        if (!Types.ObjectId.isValid(userId)) {
          throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
        }
        if (!Types.ObjectId.isValid(invitationId)) {
          throw new UserBadRequest('Invalid credentials', 'The invitation _id is invalid')
        }

        const res = await dbModel.updateOne({ _id: userId }, { $pull: { invitation: { _id: invitationId } } })
        if (res.matchedCount === 0) throw new NotFound('User not found')
        return res.acknowledged
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to remove', 'The invitation was not removed from the user, something went wrong please try again')
        )
        return false
      }
    }
  },
  group: {
    get: async function (userId: Types.ObjectId): Promise<IUserGroup[] | undefined | null> {
      try {
        if (!Types.ObjectId.isValid(userId)) {
          throw new UserBadRequest('Invalid credentials', 'The _id is invalid')
        }

        const user = await dbModel.findOne({ _id: userId }, { group: 1, _id: 0 }).lean()
        if (user === null) throw new NotFound('User not found')
        return user.group
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to access data', 'The groups were not retrieved, something went wrong please try again')
        )
        return null
      }
    },
    add: async function (account: string, group: IUserGroup): Promise<boolean> {
      try {
        validator.user.group.add(group)
        const res = await dbModel.updateOne({ account }, { $push: { group } })

        if (res.matchedCount === 0) throw new NotFound('User not found', `The user with the account ${account} was not found`)
        return res.acknowledged
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to save', 'The group was not added to the user, something went wrong please try again')
        )
        return false
      }
    },
    remove: async function (account: string, groupId: Types.ObjectId): Promise<boolean> {
      try {
        if (!verifyEmail(account)) {
          throw new UserBadRequest('Invalid credentials', 'The account is invalid')
        }
        if (!Types.ObjectId.isValid(groupId)) {
          throw new UserBadRequest('Invalid credentials', 'The group _id is invalid')
        }

        const res = await dbModel.updateOne({ account }, { $pull: { group: { _id: groupId } } })
        if (res.matchedCount === 0) throw new NotFound('User not found', `The user with the account ${account} was not found`)
        return res.acknowledged
      } catch (e) {
        errorHandler.allErrors(
          e as CustomError,
          new DatabaseError('Failed to remove', 'The group was not removed from the user, something went wrong please try again')
        )
        return false
      }
    }
  }
}

export default model
