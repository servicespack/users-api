'use strict'

const express = require('express')

const validators = require('../middlewares/validators/verifications')
const controllers = require('../controllers/verifications')
const router = express.Router()

router.post('/', [validators.create], controllers.create)

module.exports = router
