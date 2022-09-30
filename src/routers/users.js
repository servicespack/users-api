import express from 'express'

import auth from '../middlewares/auth.js'
import validators from '../middlewares/validators/users.js'
import controllers from '../controllers/users.js'

const router = express.Router()

router.post('/', [validators.create], controllers.create)
router.get('/', [auth(), validators.list], controllers.list)
router.get('/:id', [auth()], controllers.show)
router.patch('/:id', [auth({ onlyTheOwner: true }), validators.update], controllers.update)
router.put('/:id/password', [auth({ onlyTheOwner: true }), validators.updatePassword], controllers.updatePassword)
router.delete('/:id', [auth({ onlyTheOwner: true })], controllers.delete)

export default router
