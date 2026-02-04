import { Router } from 'express'
import AuthAdapter from '../adapter/Auth.adapter'

const router = Router()

router.post('/request/code/', AuthAdapter.RequestCode)
router.post('/verify/code/', AuthAdapter.VerifyCode)

router.get('/request/accessToken/', AuthAdapter.RequestAccessToken)
router.post('/request/refreshToken/code/', AuthAdapter.RequestRefreshTokenCode)
router.post('/request/refreshToken/', AuthAdapter.RequestRefreshToken)

router.patch('/account/request/code/', AuthAdapter.AccountRequestCode)
router.patch('/change/account/', AuthAdapter.ChangeAccount)

router.patch('/password/request/code/', AuthAdapter.PasswordRequestCode)
router.patch('/change/password/', AuthAdapter.ChangePassword)

router.post('/request/logout/', AuthAdapter.Logout)

export default router
