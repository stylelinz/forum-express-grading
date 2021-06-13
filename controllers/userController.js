const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      return res.redirect('/signin')
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = userController
