import { Router } from 'express'
import controller from '../../controller/group/group.controller'

const router = Router()

router.post('/get/', controller.get)
router.post('/create/', controller.create)
router.put('/update/', controller.update)
router.delete('/delete/', controller.delete)

// Members
router.patch('/member/update/role/', controller.member.update.role)
router.delete('/member/remove/', controller.member.remove)

export default router
