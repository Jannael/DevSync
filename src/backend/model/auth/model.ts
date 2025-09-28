import dbModel from './../../database/schemas/node/user'

const model = {
  verify: {
    refreshToken: async function (token: string, userId: string): Promise<boolean> {
      try {
        const result = await dbModel.findOne(
          { _id: userId },
          { refreshToken: 1, _id: 0 }
        ).lean()

        const tokens = result?.refreshToken
        return Array.isArray(tokens) && tokens.includes(token)
      } catch (e) {
        return false
      }
    }
  },
  save: {
    refreshToken: async function (token: string, userId: string) {
      try {
        await dbModel.updateOne(
          { _id: userId },
          { $push: { refreshToken: token } }
        )
        return true
      } catch {
        return false
      }
    }
  }
}

export default model
