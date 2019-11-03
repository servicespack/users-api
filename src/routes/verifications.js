const express = require('express')

const router = express.Router()
const controllers = require('../controllers/verifications')

router.patch('/:id', controllers.patch)

module.exports = router
