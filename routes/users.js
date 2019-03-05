const express = require('express')

const controller = require('../controllers/users')
const router     = express.Router()

router.get('/', controller.get)
router.get('/:id', controller.getOne)
router.post('/', controller.post)
router.delete('/:id', controller.delete)

module.exports = router
