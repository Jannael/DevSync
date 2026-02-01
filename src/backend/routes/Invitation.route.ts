import { Router } from 'express'

const router = Router()

router.get('/get/user/')
router.post('/get/group/')

router.patch('/update/role/')
router.post('/create/')
router.post('/accept/')
router.post('/reject/')
router.post('/cancel/')


export default router