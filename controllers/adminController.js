const fs = require('fs/promises')

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
      if (file) {
        const data = await fs.readFile(file.path)
        await fs.writeFile(`upload/${file.originalname}`, data)
      }
      await Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: file ? `/upload/${file.originalname}` : null
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
      if (file) {
        const data = await fs.readFile(file.path)
        await fs.writeFile(`upload/${file.originalname}`, data)
      }
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.update({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: file ? `/upload/${file.originalname}` : restaurant.image
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
