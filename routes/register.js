const express = require('express')
const router = express.Router()
const registerController = require('../controllers/register') // Importing register controller (../controllers/register.js)

router.get('/', registerController) // Set register controller

module.exports = router