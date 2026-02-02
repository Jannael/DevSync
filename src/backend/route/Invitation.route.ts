import { Router } from 'express'
import RoleMiddleware from '../middleware/Role.middleware'
import Roles from '../constant/Role.constant'

const router = Router()

router.get('/get/user/')
router.post('/get/group/')

router.patch('/update/role/', RoleMiddleware([Roles.techLead]))
router.post('/create/', RoleMiddleware([Roles.techLead]))
router.post('/cancel/', RoleMiddleware([Roles.techLead]))

router.post('/accept/')
router.post('/reject/')


export default router