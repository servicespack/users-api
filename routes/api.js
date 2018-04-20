const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api')

router.get('/', apiController.getUsers)
router.get('/:username', apiController.getOneUser)

module.exports = router
