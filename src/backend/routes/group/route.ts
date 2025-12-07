import { Router } from 'express'
import controller from '../../controller/group/group.controller'

const router = Router()

router.post('/get/', controller.get) // doc
router.post('/create/', controller.create) // doc
router.post('/update/', controller.update) // doc
router.delete('/delete/', controller.delete) // doc

// Members
router.patch('/member/update/role/', controller.member.update.role) // doc
router.delete('/member/remove/', controller.member.remove) // doc

export default router
