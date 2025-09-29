import { Router } from 'express'
import controller from './../../controller/user/controller'

const router = Router()

router.get('/get/', controller.user.get)
router.post('/create/', controller.user.create)
router.patch('/update/:id')
router.delete('/delete/:id')

export default router
