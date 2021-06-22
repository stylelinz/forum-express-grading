const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')

// path: '/users/**'
router.get('/:id', userController.getUser)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('image'), userController.putUser)

module.exports = router
