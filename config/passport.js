const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const { User, Restaurant } = db

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

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
        return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }
))

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
  const user = await User.findByPk(jwtPayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  if (!user) {
    return next(null, false)
  }
  return next(null, user)
}))

// serialize and deserialize user
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: Restaurant, as: 'LikedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })).toJSON()
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
})

module.exports = passport
