const userService = require('../service/user-service')
const UserModel = require('../models/user-model')

class UserController {
  async registration (req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json(userData)
    } catch (e) {
      console.error(e)
    }
  }

  async login (req, res, next) {
    try {

    } catch (e) {
      console.error(e)
    }
  }

  async logout (req, res, next) {
    try {

    } catch (e) {
      console.error(e)
    }
  }

  async refresh (req, res, next) {
    try {

    } catch (e) {
      console.error(e)
    }
  }

  async activate (req, res, next) {
    try {
      const activationLink = req.params.link
      await userService.activate(activationLink)

      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      console.error(e)
    }
  }

  async getUsers (req, res, next) {
    try {
      const users = await UserModel.find()
      res.json(users)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = new UserController()