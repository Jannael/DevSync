import { Router } from 'express'
import controller from '../adapter/group/group.controller'

const router = Router()

//CRUD for Group collection
router.post('/get/', controller.get)
router.post('/create/', controller.create)
router.put('/update/', controller.update)
router.delete('/delete/', controller.delete)

router.post('/get/user/') // groups of a user

// Routes for UserGroup collection
router.post('/get/member/') // members of a group
router.post('/add/member/') // members of a group
router.delete('/remove/member/') // remove a member from a group
router.delete('/update/member/role/') // update the role of a member

export default router
