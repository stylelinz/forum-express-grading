const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  // authenticate user
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({
        where: { email }
      })
      if (!user) {
        return done(null, false, req.flash('error_massage', '帳號或密碼輸入錯誤'))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('error_massage', '帳號或密碼輸入錯誤'))
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }
))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    return done(null, user.toJSON())
  } catch (error) {
    return done(error, false)
  }
})

module.exports = passport