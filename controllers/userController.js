const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')

const helpers = require('../_helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

// Helper function to upload image
const upload = (path) => {
  imgur.setClientID(process.env.IMGUR_ID)
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img)
    })
  })
}

// Helper function to remove duplicated elements
const removeDuplicate = (arr) => {
  const result = [arr[0]]
  let previous = arr[0]
  arr.forEach(element => {
    if (element.id !== previous.id) {
      result.push(element)
      previous = element
    }
  })
  return result
}

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    try {
      const user = await User.findOne({
        where: { email }
      })
      if (user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      }
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '帳號註冊成功！')
      return res.redirect('/signin')
    } catch (error) {
      console.error(error)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入。')
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '成功登出。')
    return res.redirect('/signin')
  },
  getUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      if (!id) {
        throw new Error('Invalid user id.')
      }

      const user = (await User.findByPk(id, {
        include: [
          { model: Comment, include: [Restaurant] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ],
        nest: true
      })).toJSON()

      const isFollowed = user.Followings.map(following => following.id).includes(id)
      const commentedRestaurants = removeDuplicate(user.Comments.map(comment => comment.Restaurant))

      return res.render('user_profile', { profile: user, isFollowed, commentedRestaurants })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  editUser: async (req, res) => {
    try {
      const id = parseInt(req.params.id)
      if (!id) {
        throw new Error('Invalid user id.')
      }
      const user = await User.findByPk(id)
      return res.render('edit_profile', { profile: user.toJSON() })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  putUser: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req
    try {
      const imgDataLink = file ? (await upload(file.path)).data.link : null
      if (!name) {
        throw new Error('名稱為必填。')
      }
      const user = await User.findByPk(id)
      await user.update({
        name,
        image: imgDataLink || user.image
      })
      req.flash('success_message', '資料變更成功')
      return res.redirect(`/users/${id}`)
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  addLike: async (req, res) => {
    const { id: UserId } = req.user
    try {
      await Like.create({
        UserId,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      await like.destroy()
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  getTopUser: async (req, res) => {
    try {
      const rawTopUsers = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      const topUsers = rawTopUsers.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(followings => followings.id).includes(user.id)
      }))

      topUsers.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: topUsers })
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  addFollow: async (req, res) => {
    const { id: followerId } = req.user
    try {
      await Followship.create({
        followerId,
        followingId: req.params.userId
      })
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  },
  removeFollow: async (req, res) => {
    const { id: FollowerId } = req.user
    try {
      const followship = await Followship.findOne({
        where: {
          FollowerId,
          FollowingId: req.params.userId
        }
      })
      await followship.destroy()
      return res.redirect('back')
    } catch (error) {
      req.flash('error_messages', error.toString())
      return res.redirect('back')
    }
  }
}

module.exports = userController
