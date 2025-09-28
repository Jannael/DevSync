import { Router } from 'express'
import controller from './../../controller/auth/controller'

const router = Router()

router.post('/request/code', controller.request.code)
router.post('/verify/code', controller.verify.code)

router.get('/request/accessToken', controller.request.accessToken)
router.post('/request/refreshToken', controller.request.refreshToken)

export default { auth: { router } }
