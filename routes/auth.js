const express = require('express')

const controllers = require('../controllers/auth')
const router      = express.Router()

router.get('/', controllers.get)
router.post('/', controllers.post)

module.exports = router
