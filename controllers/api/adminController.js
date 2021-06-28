const imgur = require('imgur-node-api')

const { Restaurant, User, Category, sequelize } = require('../../models')

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

const adminService = require('../../services/adminService')

const adminController = {
  // Restaurants
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await adminService.getRestaurants(req, res)
      return res.json({ restaurants })
    } catch (error) {
      return res.json({ error })
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await adminService.getRestaurant(req, res)
      return res.json({ restaurant })
    } catch (error) {
      return res.json({ error })
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const deleteStatus = await adminService.deleteRestaurant(req, res)
      return res.json(deleteStatus)
    } catch (error) {
      return res.json({ error })
    }
  }
}

module.exports = adminController
