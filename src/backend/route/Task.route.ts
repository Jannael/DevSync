import { Router } from 'express'
import Adapter from '../adapter/Task.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/get/', RoleMiddleware(ValidRoles), Adapter.get)
router.post('/list/', RoleMiddleware(ValidRoles), Adapter.list)

router.put('/update/', RoleMiddleware([Roles.techLead]), Adapter.update)
router.post('/create/', RoleMiddleware([Roles.techLead]), Adapter.create)
router.delete('/delete/', RoleMiddleware([Roles.techLead]), Adapter.delete)

export default router
