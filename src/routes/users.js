const express = require('express')

const authMiddleware = require('../middlewares/auth')
const validators = require('../middlewares/validators/users')
const controllers = require('../controllers/users')
const router = express.Router()

router.post('/', [validators.create], controllers.post)
router.get('/', [authMiddleware, validators.list], controllers.get)
router.get('/:id', [authMiddleware], controllers.getOne)
router.patch('/:id', [authMiddleware, validators.update], controllers.patch)
router.delete('/:id', [authMiddleware], controllers.delete)

module.exports = router
