import { Router } from 'express'
import controller from './../../controller/auth/controller'

const router = Router()

router.post('/request/code', controller.request.code)
router.post('/request/accessToken', controller.request.accessToken)
router.post('/verify/code', controller.verify.code)
router.post('/verify/refreshToken', controller.verify.refreshToken)

export default { auth: { router } }
