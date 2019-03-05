const express = require('express')
const router = express.Router()
const controller = require('../controllers/users')

router.get('/', controller.get)
router.get('/:id', controller.getOne)
router.post('/', controller.post)

module.exports = router
