import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll, edit, get, getId, getByPlay, getByGo, getByBuy, getByHotel } from '../controllers/activity.js'
import upload from '../middlewares/upload.js'
const router = Router()

router.post('/', auth.jwt, upload, create)
router.get('/all', auth.jwt, getAll)
router.patch('/:id', auth.jwt, upload, edit)
router.get('/', get)
router.get('/play', getByPlay)
router.get('/go', getByGo)
router.get('/buy', getByBuy)
router.get('/hotel', getByHotel)
router.get('/:id', getId)

export default router
