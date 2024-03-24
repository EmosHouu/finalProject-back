import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll, edit, get, getId, getByPlay, getByGo, getByBuy, getByHotel } from '../controllers/activity.js'
import upload from '../middlewares/upload.js'
const router = Router()

router.post('/', auth.jwt, upload, create)
router.get('/all', auth.jwt, getAll)
router.patch('/:id', auth.jwt, upload, edit)
router.get('/', get)
// '/play'是一個路由，當使用者訪問'/play'時，會執行getByPlay函數，此函數是在controllers/activity.js中定義的
router.get('/play', getByPlay)
router.get('/go', getByGo)
router.get('/buy', getByBuy)
router.get('/hotel', getByHotel)
router.get('/:id', getId)

export default router
