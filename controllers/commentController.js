const { Comment } = require('../models')

const commentController = {
  postComment: async (req, res) => {
    const { text, restaurantId: RestaurantId } = req.body
    try {
      await Comment.create({
        text,
        RestaurantId,
        UserId: req.user.id
      })
      return res.redirect(`/restaurants/${RestaurantId}`)
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params
    try {
      const comment = await Comment.findByPk(id)
      await comment.destroy()
      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  }
}

module.exports = commentController
