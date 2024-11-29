import { Router } from 'express'
import { URLcontroller } from '../controllers/urlShorts.js'

const router = Router()

router.get('/q/:hash', URLcontroller.getUrl)

router.post('/create', URLcontroller.createUrl)

router.post('/create-custom', URLcontroller.createCustomUrl)

export default router
