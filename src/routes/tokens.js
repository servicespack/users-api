const express = require('express')

const router = express.Router()
const controllers = require('../controllers/tokens')

router.post('/', controllers.post)

module.exports = router
