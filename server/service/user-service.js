const bcrypt = require('bcrypt')
const uuid = require('uuid')

const UserModel = require('../models/user-model')
const UserDto = require('../dto/user-dto')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration (email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(`User ${email} Exist`)
    }

    const hashPass = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await UserModel.create(
      { email, password: hashPass, activationLink })

    await mailService.sendActivationMail(email, activationLink)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async activate (activationLink) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest(('User does not exist'))
    }

    await UserModel.updateOne({ activationLink }, { isActivated: true })
  }
}

module.exports = new UserService()