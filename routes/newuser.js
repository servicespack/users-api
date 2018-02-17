const express = require('express')
const router = express.Router()
const newuserController = require('../controllers/newuser')

router.post('/', newuserController)
module.exports = router
