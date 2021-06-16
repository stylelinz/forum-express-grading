const multer = require('multer')
const express = require('express')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const adminController = require('../controllers/adminController')

// 後台
router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/create', adminController.createRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', adminController.editRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router
