import { Router } from 'express'
import controller from './../../controller/group/controller'

const router = Router()

router.get('/get/', controller.get) // test
router.post('/create/', controller.create) // test
router.post('/update/', controller.update) // test
router.post('/delete/', controller.delete) // test

// Members
router.patch('/member/update/role/', controller.member.update.role) // test
router.delete('/member/remove/', controller.member.remove) // test

export default router
