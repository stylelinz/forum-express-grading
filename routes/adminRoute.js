const multer = require('multer')
const express = require('express')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const adminController = require('../controllers/adminController')

// 後台
router.get('/', (req, res) => res.redirect('/admin/restaurants'))
router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/users', adminController.getUsers)
router.put('/users/:id/toggleAdmin', adminController.toggleAdmin)

module.exports = router
