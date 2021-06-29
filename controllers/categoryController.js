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
    try {
      const postStatus = await categoryService.postCategory(req, res)
      req.flash('success_messages', postStatus.message)
      return res.redirect('/admin/categories')
    } catch (error) {
      req.flash('error_messages', error.message)
      return res.redirect('back')
    }
  },

  putCategory: async (req, res) => {
    try {
      const putStatus = await categoryService.putCategory(req, res)
      req.flash('success_messages', putStatus.message)
      return res.redirect('/admin/categories')
    } catch (error) {
      req.flash('error_messages', error.message)
      return res.redirect('back')
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
