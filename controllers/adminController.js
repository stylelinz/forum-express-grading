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
  }
}

module.exports = adminController
