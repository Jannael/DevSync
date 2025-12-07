import { Router } from 'express'
import controller from './../../controller/auth/auth.controller'

const router = Router()

router.post('/request/code/', controller.request.code) // doc
router.post('/verify/code/', controller.verify.code) // doc

router.get('/request/accessToken/', controller.request.accessToken) // doc
router.post('/request/refreshToken/code/', controller.request.refreshToken.code) // doc
router.post('/request/refreshToken/', controller.request.refreshToken.confirm) // doc

router.patch('/account/request/code/', controller.account.request.code) // doc
router.patch('/account/verify/code/', controller.account.verify.code) // doc

router.patch('/password/request/code/', controller.pwd.request.code) // doc
router.patch('/password/verify/code/', controller.pwd.verify.code) // doc

router.post('/request/logout/', controller.request.logout) // doc

export default router
