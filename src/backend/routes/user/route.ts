import { Router } from 'express'
import controller from './../../controller/user/controller'

const router = Router()

router.get('/get/', controller.user.get)
router.post('/create/', controller.user.create)
router.put('/update/', controller.user.update)
router.delete('/delete/', controller.user.delete)

router.patch('/update/account/request/code')
router.patch('/update/account/verify/code')
router.patch('/update/account/')

export default router
