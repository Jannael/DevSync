import { Router } from 'express'
import Adapter from '../adapter/Group.adapter'

const router = Router()

//CRUD for Group collection
router.post('/get/', Adapter.get)
router.post('/create/', Adapter.create)
router.put('/update/', Adapter.update)
router.delete('/delete/', Adapter.delete)

router.post('/get/user/') // groups of a user

// Routes for UserGroup collection
router.post('/get/member/') // members of a group
router.post('/add/member/') // members of a group
router.delete('/remove/member/') // remove a member from a group
router.delete('/update/member/role/') // update the role of a member

export default router
