import { Router } from 'express'
import Adapter from '../adapter/User.adapter'

const router = Router()

router.get('/get/', Adapter.get)
router.get('/get/group/', Adapter.get)
router.put('/update/', Adapter.update)
router.post('/create/', Adapter.create)
router.delete('/delete/', Adapter.delete)

router.patch('/update/account/', Adapter.account.update)
router.patch('/update/password/', Adapter.password.update)

export default router
