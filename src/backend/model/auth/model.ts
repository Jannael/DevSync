import dbModel from './../../database/schemas/node/user'

const model = {
  verify: {
    refreshToken: async function (token: string, userId: string): Promise<boolean> {
      try {
        const result = await dbModel.findOne(
          { _id: userId },
          { refreshToken: 1, _id: 0 }
        ).lean()

        const { refreshToken } = result ?? {}
        if (refreshToken !== null && refreshToken === token) { return true }
        return false
      } catch (e) {
        return false
      }
    }
  }
}

export default model
