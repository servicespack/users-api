const express = require('express')
const router = express.Router()
const newuserController = require('../controllers/newuser') // Importing newuser controller (../controllers/newuser.js)

router.post('/', newuserController) // Set newuser controller
module.exports = router
