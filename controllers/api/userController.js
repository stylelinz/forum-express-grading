const bcrypt = require('bcryptjs')

const { User } = require('../../models')

const jwt = require('jsonwebtoken')

const userController = {
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new Error('Required fields did not exist.')
      }
      const user = await User.findOne({
        where: {
          email
        }
      })
      if (!user) {
        throw new Error('No such user found.')
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Password did not match.')
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'sign in',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    } catch (error) {
      return res.json({ status: error.name, message: error.message })
    }
  },

  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      if (password !== passwordCheck) {
        throw new Error('兩次密碼輸入不同！')
      }
      const user = await User.findOne({
        where: { email }
      })
      if (user) {
        throw new Error('信箱重複！')
      }
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      return res.json({ status: 'success', message: '帳號註冊成功！' })
    } catch (error) {
      return res.json({ status: error.name, message: error.message })
    }
  }
}

module.exports = userController
