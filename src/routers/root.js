import express from 'express'

import controllers from '../controllers/root.js'

const router = express.Router()

router.get('/', controllers.get)

export default router
