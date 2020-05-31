const express = require('express')

const authMiddleware = require('../middlewares/auth')
const validators = require('../middlewares/validators/users')
const controllers = require('../controllers/users')
const router = express.Router()

router.post('/', [validators.create], controllers.create)
router.get('/', [authMiddleware, validators.list], controllers.list)
router.get('/:id', [authMiddleware], controllers.show)
router.patch('/:id', [authMiddleware, validators.update], controllers.update)
router.delete('/:id', [authMiddleware], controllers.delete)

module.exports = router
