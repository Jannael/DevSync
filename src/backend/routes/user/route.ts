import { Router } from 'express'
import controller from './../../controller/user/controller'

const router = Router()

router.get('/get/', controller.user.get)
router.post('/create/', controller.user.create)
router.put('/update/', controller.user.update)
router.patch('/update/account')
router.delete('/delete/', controller.user.delete)

export default router
