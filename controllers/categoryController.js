const { Category } = require('../models')

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: async (req, res) => {
    const { id } = req.params
    try {
      const categories = await categoryService.getCategories(req, res)
      const category = id ? await categoryService.getCategory(req, res) : null

      return res.render('admin/categories', { categories, category })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  postCategory: async (req, res) => {
    const { name } = req.body
    try {
      if (!name.trim().length) {
        throw new Error('Name did not exist.')
      }
      await Category.create({ name })
      req.flash('success_messages', 'Add category success.')
      return res.redirect('/admin/categories')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.status(400).redirect('back')
    }
  },

  putCategory: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
      if (!name.trim().length) {
        throw new Error('Name did not exist.')
      }
      const category = await Category.findByPk(id)
      await category.update({ name })
      req.flash('success_messages', 'Category name changed.')
      return res.redirect('/admin/categories')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.status(400).redirect('back')
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params
    try {
      const category = await Category.findByPk(id)
      await category.destroy()
      req.flash('success_messages', 'Category removed.')
      return res.redirect('/admin/categories')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.status(400).redirect('back')
    }
  }
}

module.exports = categoryController
