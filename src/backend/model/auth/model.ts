const model = {
  verify: {
    refreshToken: async function (token: string): Promise<boolean> {
      return true
    }
  }
}

export default model
