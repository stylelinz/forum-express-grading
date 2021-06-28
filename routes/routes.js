const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')

const adminRoute = require('./adminRoute')
const userRoute = require('./userRoute')

const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticateUser = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!req.user) {
      req.user = helpers.getUser(req)
    }
    return next()
  }
  return res.redirect('/signin')
}

const authenticateAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

// 前台
router.get('/', authenticateUser, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticateUser, restController.getRestaurants)
router.get('/restaurants/feeds', authenticateUser, restController.getFeeds)
router.get('/restaurants/top', authenticateUser, restController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticateUser, restController.getDashboard)
router.get('/restaurants/:id', authenticateUser, restController.getRestaurant)

router.post('/comments', authenticateUser, commentController.postComment)
router.delete('/comments/:id', authenticateAdmin, commentController.deleteComment)

router.post('/favorite/:restaurantId', authenticateUser, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticateUser, userController.removeFavorite)

router.post('/like/:restaurantId', authenticateUser, userController.addLike)
router.delete('/like/:restaurantId', authenticateUser, userController.removeLike)

router.post('/following/:userId', authenticateUser, userController.addFollow)
router.delete('/following/:userId', authenticateUser, userController.removeFollow)

router.use('/users', authenticateUser, userRoute)

// 後台
router.use('/admin', authenticateAdmin, adminRoute)

// 使用者
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate(
  'local', { failureRedirect: '/signin', failureFlash: true }
), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router
