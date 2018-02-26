const express = require('express')
const router = express.Router()
const loginController = require('../controllers/login') // Importing login controller (../controllers/login.js)

router.get('/', loginController) // Set index controller

module.exports = router
