import { Router } from 'express'
import controller from './../../controller/user/controller'

const router = Router()

router.get('/get/:id', controller.user.create)
router.post('/create/')
router.patch('/update/:id')
router.delete('/delete/:id')

export default router
