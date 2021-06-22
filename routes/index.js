const restController = require('../controllers/restController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')

const adminRoute = require('./adminRoute')
const userRoute = require('./userRoute')

const helpers = require('../_helpers')

module.exports = (app, passport) => {
  const authenticateUser = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
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
  app.get('/', authenticateUser, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticateUser, restController.getRestaurants)
  app.get('/restaurants/:id', authenticateUser, restController.getRestaurant)
  app.post('/comments', authenticateUser, commentController.postComment)
  app.delete('/comments/:id', authenticateAdmin, commentController.deleteComment)
  app.use('/users', authenticateUser, userRoute)

  // 後台
  app.use('/admin', authenticateAdmin, adminRoute)

  // 使用者
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate(
    'local', { failureRedirect: '/signin', failureFlash: true }
  ), userController.signIn)
  app.get('/logout', userController.logout)
}
