import { Router } from 'express'
import Adapter from '../adapter/Solution.adapter'
import RoleMiddleware from '../middleware/Role.middleware'
import Roles from '../constant/Role.constant'

const router = Router()

router.post('/get/', RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]), Adapter.get)

router.put('/update/', RoleMiddleware([Roles.techLead, Roles.developer]), Adapter.update)
router.post('/create/', RoleMiddleware([Roles.techLead, Roles.developer]), Adapter.create)
router.delete('/delete/', RoleMiddleware([Roles.techLead, Roles.developer]), Adapter.delete)

export default router
