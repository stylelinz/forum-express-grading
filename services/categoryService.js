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
  }

}

module.exports = categoryService
