import { Router } from 'express'
import Adapter from '../adapter/User.adapter'

const router = Router()

router.get('/get/', Adapter.get)
router.get('/get/group/', Adapter.group.get)

router.put('/update/', Adapter.update)
router.post('/create/', Adapter.create)
router.delete('/delete/', Adapter.delete)

export default router
