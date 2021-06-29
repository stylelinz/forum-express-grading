const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await categoryService.getCategories(req, res)
      return res.json({ categories })
    } catch (error) {
      return res.json({ error })
    }
  },

  postCategory: async (req, res) => {
    try {
      const postStatus = await categoryService.postCategory(req, res)
      return res.json(postStatus)
    } catch (error) {
      return res.json({ status: error.name, message: error.message })
    }
  },

  putCategory: async (req, res) => {
    try {
      const putStatus = await categoryService.putCategory(req, res)
      return res.json(putStatus)
    } catch (error) {
      return res.json({ status: error.name, message: error.message })
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deleteStatus = await categoryService.deleteCategory(req, res)
      return res.json(deleteStatus)
    } catch (error) {
      return res.json({ status: error.name, message: error.message })
    }
  }
}

module.exports = categoryController
