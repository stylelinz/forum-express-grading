const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await categoryService.getCategories(req, res)
      return res.json({ categories })
    } catch (error) {
      return res.json({ error })
    }
  }
}

module.exports = categoryController
