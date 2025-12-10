import { Request, Response, Router } from 'express'
import auth from '../../middleware/auth'

const router = Router()

router.get('/healthChecker/', (req: Request, res: Response) => {
  res.json({ ok: 1 })
})

router.post('/protected/', auth(['techLead']), (req: Request, res: Response) => {
  res.json({ ok: 1 })
})

export default router
