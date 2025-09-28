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
  }
}

export default model
