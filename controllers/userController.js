const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    try {
      const user = await User.findOne({
        where: { email }
      })
      if (user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      }
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '帳號註冊成功！')
      return res.redirect('/signin')
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = userController
