import { Router } from 'express'
import Adapter from '../adapter/Auth.adapter'

const router = Router()

router.post('/request/code/', Adapter.request.code)
router.post('/verify/code/', Adapter.verify.code)

router.get('/request/accessToken/', Adapter.request.accessToken)
router.post('/request/refreshToken/code/', Adapter.request.refreshToken.code)
router.post('/request/refreshToken/', Adapter.request.refreshToken.confirm)

router.patch('/account/request/code/', Adapter.account.request.code)
router.patch('/change/account/', Adapter.account.verify.code)

router.patch('/password/request/code/', Adapter.pwd.request.code)
router.patch('/change/password/', Adapter.pwd.verify.code)

router.post('/request/logout/', Adapter.request.logout)

export default router
