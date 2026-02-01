import { Router } from 'express'

const router = Router()

router.post('/get/member/') // members of a group
router.post('/add/member/') // members of a group
router.delete('/remove/member/') // remove a member from a group
router.delete('/update/member/role/') // update the role of a member

export default router
