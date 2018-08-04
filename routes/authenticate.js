const express = require('express')
const router = express.Router()
const controller = require('../controllers/authenticate')

router.post('/', controller.post)

module.exports = router
