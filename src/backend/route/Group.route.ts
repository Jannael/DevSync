import { Router } from 'express'
import Adapter from '../adapter/Group.adapter'

const router = Router()

//CRUD for Group collection
router.post('/get/', Adapter.get)
router.post('/create/', Adapter.create)
router.put('/update/', Adapter.update)
router.delete('/delete/', Adapter.delete)

router.post('/get/user/') // groups of a user

export default router
