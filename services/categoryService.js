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
  }
}

module.exports = categoryService
