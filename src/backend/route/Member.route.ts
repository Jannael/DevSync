import { Router } from 'express'

const router = Router()

router.post('/get/') // members of a group
router.delete('/remove/') // remove a member from a group
router.delete('/update/role/') // update the role of a member

export default router
