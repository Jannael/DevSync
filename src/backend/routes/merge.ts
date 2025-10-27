import authRouter from './auth/route'
import userRouter from './user/route'
import utilsRouter from './utils/route'
import groupRouter from './group/route'

export default {
  auth: authRouter,
  user: userRouter,
  utils: utilsRouter,
  group: groupRouter
}
