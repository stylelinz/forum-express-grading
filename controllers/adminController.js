const imgur = require('imgur-node-api')

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
      const { file } = req
      let img
      if (file) {
        img = await upload(file.path)
      }
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: img.data.link ?? null
      })
      req.flash('success_messages', '新增餐廳成功。')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      console.error(error)
      res.redirect('back')
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  editRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      return res.render('admin/create', { restaurant })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  putRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', '名稱為必填。')
      return res.redirect('back')
    }
    try {
      const { file } = req
      let img
      if (file) {
        img = await upload(file.path)
      }
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: img.data.link ?? restaurant.image
      })
      req.flash('success_messages', `餐廳 ${name} 更新成功。`)
      return res.redirect('/admin/restaurants')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      req.flash('success_messages', '餐廳刪除成功。')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  }
}

module.exports = adminController