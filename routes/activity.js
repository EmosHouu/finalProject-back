import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll, edit, get, getId } from '../controllers/activity.js'
import upload from '../middlewares/upload.js'
const router = Router()

router.post('/', auth.jwt, upload, create)
router.get('/all', auth.jwt, getAll)
router.patch('/:id', auth.jwt, upload, edit)
router.get('/', get)
router.get('/:id', getId)
export default router