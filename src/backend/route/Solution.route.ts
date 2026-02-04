import { Router } from 'express'
import SolutionAdapter from '../adapter/Solution.adapter'
import { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/get/', RoleMiddleware(ValidRoles), SolutionAdapter.Get)
router.put('/update/', RoleMiddleware(ValidRoles), SolutionAdapter.Update)
router.post('/create/', RoleMiddleware(ValidRoles), SolutionAdapter.Create)
router.delete('/delete/', RoleMiddleware(ValidRoles), SolutionAdapter.Delete)

export default router
