import { Router } from 'express'
import Roles from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.get('/get/user/')
router.post(
	'/get/group/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
)

router.patch('/update/role/', RoleMiddleware([Roles.techLead]))
router.post('/create/', RoleMiddleware([Roles.techLead]))
router.post('/cancel/', RoleMiddleware([Roles.techLead]))

router.post('/accept/')
router.post('/reject/')

export default router
