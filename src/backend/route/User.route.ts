import { Router } from 'express'
import UserAdapter from '../adapter/User.adapter'

const router = Router()

router.get('/get/', UserAdapter.Get)
router.get('/get/group/', UserAdapter.GetGroup)
router.post('/get/invitation/', UserAdapter.GetInvitation)

router.put('/update/', UserAdapter.Update)
router.post('/create/', UserAdapter.Create)
router.delete('/delete/', UserAdapter.Delete)

export default router
