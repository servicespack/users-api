const express = require('express')

const authMiddleware = require('../middlewares/auth')
const controller     = require('../controllers/users')
const router         = express.Router()

router.post('/', controller.post)
router.get('/', authMiddleware, controller.get)
router.get('/:id', authMiddleware, controller.getOne)
router.delete('/:id', authMiddleware, controller.delete)

module.exports = router
