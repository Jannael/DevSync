import { Router } from 'express'
import controller from '../adapter/user/user.controller'

const router = Router()

router.get('/get/', controller.get)
router.put('/update/', controller.update)
router.post('/create/', controller.create)
router.delete('/delete/', controller.delete)

router.patch('/update/account/', controller.account.update)
router.patch('/update/password/', controller.password.update)

export default router
