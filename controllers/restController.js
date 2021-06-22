const { Restaurant, Category, Comment, User } = require('../models')

const PAGE_LIMIT = 10

const restController = {
  getRestaurants: async (req, res) => {
    const categoryId = parseInt(req.query.categoryId) || ''
    const whereQuery = categoryId ? { CategoryId: categoryId } : {}
    let offset = 0
    if (req.query.page) {
      offset = (parseInt(req.query.page) - 1) * PAGE_LIMIT
    }
    try {
      const [queryResults, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: whereQuery,
          nest: true,
          offset,
          limit: PAGE_LIMIT
        }),
        Category.findAll({ raw: true })
      ])

      const currentPage = parseInt(req.query.page) || 1
      const totalPage = ~~(queryResults.count / PAGE_LIMIT) + 1
      const totalPages = Array.from({ length: totalPage }, (_, index) => index + 1)
      const prev = currentPage - 1 ? currentPage - 1 : 1
      const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

      const restaurants = queryResults.rows.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description.substring(0, 50),
        categoryName: restaurant.Category.name
      }))
      return res.render('restaurants', {
        restaurants,
        categories,
        categoryId,
        totalPages,
        prev,
        next
      })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.status(500).redirect('back')
    }
  },

  getRestaurant: async (req, res) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          Category,
          {
            model: Comment,
            include: [User]
          }
        ]
      })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.status(500).redirect('back')
    }
  },

  getFeeds: async (req, res) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['updatedAt', 'DESC']],
          include: [Category],
          nest: true,
          raw: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['updatedAt', 'DESC']],
          include: [Restaurant, User],
          nest: true,
          raw: true
        })
      ])
      return res.render('feeds', { restaurants, comments })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.render('back')
    }
  }
}

module.exports = restController
