import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })


const controller = {
  request: {
    code: async function () {},
    accessToken: async function () {}
  },
  verify: {
    code: async function () {},
    refreshToken: async function () {}
  }
}

export default controller
