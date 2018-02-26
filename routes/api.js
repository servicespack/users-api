const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api') // Importing api controller (../controllers/api.js)

router.get('/', apiController.allUsers) // Controller for all users
router.get('/:username', apiController.thisUser) // Controller for one user


module.exports = router
