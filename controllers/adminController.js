const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      console.error(error)
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', '名稱為必填。')
      return res.redirect('back')
    }
    try {
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description
      })
      req.flash('success_messages', '新增餐廳成功。')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      console.error(error)
      res.redirect('back')
    }
  }
}

module.exports = adminController
