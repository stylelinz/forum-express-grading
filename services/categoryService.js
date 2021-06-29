const { Category } = require('../models')

const categoryService = {
  getCategories: async (req, res) => {
    try {
      return await Category.findAll({
        raw: true
      })
    } catch (error) {
      throw Error(error)
    }
  },

  getCategory: async (req, res) => {
    try {
      const category = (await Category.findByPk(req.params.id)).toJSON()
      return category
    } catch (error) {
      throw new Error(error)
    }
  },

  postCategory: async (req, res) => {
    const { name } = req.body
    try {
      if (!name.trim().length) {
        throw new Error('Name did not exist.')
      }
      await Category.create({ name })
      return { status: 'success', message: `Add category ${name} success.` }
    } catch (error) {
      throw new Error(error.message)
    }
  },

  putCategory: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    if (!name.trim().length) {
      throw new Error('Name did not exist.')
    }
    const category = await Category.findByPk(id)
    await category.update({ name })
    return { status: 'success', message: 'Category name update success.' }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params
    const category = await Category.findByPk(id)
    await category.destroy()
    return { status: 'success', message: 'Category removed.' }
  }

}

module.exports = categoryService
