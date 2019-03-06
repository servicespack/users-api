const express = require('express')

const authMiddleware = require('../middlewares/auth')
const controllers    = require('../controllers/users')
const router         = express.Router()

router.post('/', controllers.post)
router.get('/', authMiddleware, controllers.get)
router.get('/:id', authMiddleware, controllers.getOne)
router.delete('/:id', authMiddleware, controllers.delete)

module.exports = router
