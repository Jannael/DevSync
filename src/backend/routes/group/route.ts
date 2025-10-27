import { Router } from 'express'
import controller from './../../controller/group/controller'

const router = Router()

router.get('/get/', controller.get)
router.post('/create/', controller.create)
router.post('/update/', controller.update)
router.post('/delete/', controller.delete)

export default router
