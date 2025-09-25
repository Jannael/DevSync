import { Router } from 'express'

const router = Router()

router.get('/get/:id')
router.post('/create/')
router.patch('/update/:id')
router.delete('/delete/:id')

export default router
