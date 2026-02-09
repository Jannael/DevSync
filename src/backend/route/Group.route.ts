import { Router } from 'express'
import GroupAdapter from '../adapter/Group.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/create/', GroupAdapter.Create)

router.post(
	'/get/',
	RoleMiddleware(ValidRoles, GroupAdapter.Get.ErrorLink),
	GroupAdapter.Get,
)
router.post(
	'/get/invitation/',
	RoleMiddleware([Roles.techLead], GroupAdapter.GetInvitation.ErrorLink),
	GroupAdapter.GetInvitation,
)

router.put(
	'/update/',
	RoleMiddleware([Roles.techLead], GroupAdapter.Update.ErrorLink),
	GroupAdapter.Update,
)
router.delete(
	'/delete/',
	RoleMiddleware([Roles.techLead], GroupAdapter.Delete.ErrorLink),
	GroupAdapter.Delete,
)

router.post('/join/', GroupAdapter.Join)
router.post(
	'/quit/',
	RoleMiddleware(ValidRoles, GroupAdapter.Quit.ErrorLink),
	GroupAdapter.Quit,
)

export default router
