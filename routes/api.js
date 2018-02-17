const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api')

router.get('/', apiController.allUsers)
router.get('/:username', apiController.thisUser)


module.exports = router
