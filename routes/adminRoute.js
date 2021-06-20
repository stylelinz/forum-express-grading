const multer = require('multer')
const express = require('express')
const upload = multer({ dest: 'temp/' })
const router = express.Router()

const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

// Restaurants' routes
router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// Users' routes
router.get('/users', adminController.getUsers)
router.put('/users/:id/toggleAdmin', adminController.toggleAdmin)

// categories' routes
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

module.exports = router
