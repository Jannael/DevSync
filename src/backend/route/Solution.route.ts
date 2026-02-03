import { Router } from 'express'
import Adapter from '../adapter/Solution.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/get/', RoleMiddleware(ValidRoles), Adapter.get)
router.put('/update/', RoleMiddleware(ValidRoles), Adapter.update)
router.post('/create/', RoleMiddleware(ValidRoles), Adapter.create)
router.delete('/delete/', RoleMiddleware(ValidRoles), Adapter.delete)

export default router
