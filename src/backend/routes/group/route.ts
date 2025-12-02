import { Router } from 'express'
import controller from './../../controller/group/controller'

const router = Router()

router.get('/get/', controller.get) // test
router.post('/create/', controller.create) // test
router.post('/update/', controller.update) // test
router.post('/delete/', controller.delete) // test

// Members
router.delete('/member/remove/', controller.member.remove)

export default router
