import { Router } from 'express'
import controller from './../../controller/user/controller'

const router = Router()

router.get('/get/', controller.get)
router.get('/get/invitation/', controller.invitation.get) //
router.get('/get/group/', controller.group.get) //

router.post('/create/', controller.create)
router.post('/create/invitation/', controller.invitation.create) //

router.put('/update/', controller.update)
router.delete('/delete/', controller.delete)
router.delete('/delete/group/', controller.group.remove) //

router.patch('/update/account/', controller.account.update)
router.patch('/update/password/', controller.password.update)

export default router
