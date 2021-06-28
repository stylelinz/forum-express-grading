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
      return (await Restaurant.findByPk(req.params.id,
        { include: [Category] }
      )).toJSON()
    } catch (error) {
      return error
    }
  },

  postRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    if (!name) {
      return { status: 'error', message: 'Name did not exist.' }
    }
    try {
      const { file } = req
      const img = file ? await upload(file.path) : null
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: img ? img.data.link : null,
        CategoryId
      })
      return { status: 'success', message: 'Restaurant was successfully created.' }
    } catch (error) {
      throw Error(error)
    }
  },

  putRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    try {
      if (!name) {
        throw new Error('Name did not exist.')
      }
      const { file } = req
      const img = file ? await upload(file.path) : null
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: img ? img.data.link : restaurant.image,
        CategoryId
      })
      return { status: 'success', message: `Restaurant ${name} was successfully updated.` }
    } catch (error) {
      console.log(error.stack)
      return { status: 'error', message: error.toString() }
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      return { status: 'success', message: 'Restaurant was successfully deleted.' }
    } catch (error) {
      throw Error(error)
    }
  }

}

module.exports = adminController
