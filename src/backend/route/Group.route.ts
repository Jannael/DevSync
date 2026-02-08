import { Router } from 'express'
import GroupAdapter from '../adapter/Group.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/get/', RoleMiddleware(ValidRoles), GroupAdapter.Get)
router.post(
	'/get/invitation/',
	RoleMiddleware([Roles.techLead]),
	GroupAdapter.GetInvitation,
)

router.post('/create/', GroupAdapter.Create)
router.put('/update/', RoleMiddleware([Roles.techLead]), GroupAdapter.Update)
router.delete('/delete/', RoleMiddleware([Roles.techLead]), GroupAdapter.Delete)

router.post('/join/', GroupAdapter.Join)
router.post('/quit/', RoleMiddleware(ValidRoles), GroupAdapter.Quit)

export default router
