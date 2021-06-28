const imgur = require('imgur-node-api')

const { Restaurant, User, Category, sequelize } = require('../models')

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
      return await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
    } catch (error) {
      return error
    }
  },

  getRestaurant: async (req, res) => {
    try {
      return await Restaurant.findByPk(req.params.id,
        { raw: true, nest: true, include: [Category] }
      )
    } catch (error) {
      return error
    }
  }

}

module.exports = adminController
