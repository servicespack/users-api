'use strict'

const express = require('express')

const auth = require('../middlewares/auth')
const validators = require('../middlewares/validators/users')
const controllers = require('../controllers/users')
const router = express.Router()

router.post('/', [validators.create], controllers.create)
router.get('/', [auth(), validators.list], controllers.list)
router.get('/:id', [auth()], controllers.show)
router.patch('/:id', [auth({ onlyTheOwner: true }), validators.update], controllers.update)
router.put('/:id/password', [auth({ onlyTheOwner: true }), validators.updatePassword], controllers.updatePassword)
router.delete('/:id', [auth({ onlyTheOwner: true })], controllers.delete)

module.exports = router
