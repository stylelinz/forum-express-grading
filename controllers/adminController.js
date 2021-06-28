const imgur = require('imgur-node-api')

const { Restaurant, User, Category, sequelize } = require('../models')

const adminService = require('../services/adminService')

// Helper function to upload image
const upload = (path) => {
  imgur.setClientID(process.env.IMGUR_ID)
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img)
    })
  })
}

// Helper function to get numbers of admins
const getAdmins = async () => {
  const [{ adminCount }] = await User.findAll({
    where: { isAdmin: true },
    attributes: [
      [sequelize.fn('count', sequelize.col('isAdmin')), 'adminCount']
    ],
    raw: true
  })
  return adminCount
}

const adminController = {
  // Restaurants
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await adminService.getRestaurants(req, res)
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      console.error(error)
    }
  },

  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true
      })
      return res.render('admin/create', { categories })
    } catch (error) {
      req.flash(error.toString())
      return res.redirect('back')
    }
  },

  postRestaurant: async (req, res) => {
    try {
      const postStatus = await adminService.postRestaurant(req, res)
      if (postStatus.status !== 'success') {
        throw new Error(postStatus.message)
      }
      req.flash('success_messages', postStatus.message)
      return res.redirect('/admin/restaurants')
    } catch (error) {
      req.flash('error_messages', error.toString())
      res.redirect('back')
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await adminService.getRestaurant(req, res)
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  editRestaurant: async (req, res) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, { raw: true }),
        Category.findAll({ raw: true, nest: true })
      ])
      return res.render('admin/create', { restaurant, categories })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  putRestaurant: async (req, res) => {
    try {
      const putStatus = await adminService.putRestaurant(req, res)
      if (putStatus.status !== 'success') {
        throw Error(putStatus.message)
      }
      req.flash('success_messages', putStatus.message)
      return res.redirect('/admin/restaurants')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const deleteStatus = await adminService.deleteRestaurant(req, res)
      if (deleteStatus.status === 'success') {
        req.flash('success_messages', '餐廳刪除成功。')
        return res.redirect('/admin/restaurants')
      }
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  // Users
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true, nest: true
      })
      return res.render('admin/users', { users })
    } catch (error) {
      console.error(error)
      return res.redirect('back')
    }
  },

  toggleAdmin: async (req, res) => {
    try {
      const [user, adminCount] = await Promise.all([
        User.findByPk(req.params.id),
        getAdmins()
      ])

      // 避免沒有使用者的狀況出現
      if (adminCount <= 1 && user.isAdmin) {
        throw Error('It should have at least one admin.')
      }

      await user.update({
        isAdmin: !user.isAdmin
      })
      req.flash('success_messages', 'The role of user is changed.')
      return res.redirect('/admin/users')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  }
}

module.exports = adminController
