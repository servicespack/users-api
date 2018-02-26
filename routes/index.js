const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index') // Importing index controller (../controllers/index.js)

router.get('/', indexController) // Set index controller

module.exports = router
