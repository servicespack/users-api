'use strict'

const express = require('express')

const router = express.Router()
const validators = require('../middlewares/validators/tokens')
const controllers = require('../controllers/tokens')

router.post('/', [validators.create], controllers.create)

module.exports = router
