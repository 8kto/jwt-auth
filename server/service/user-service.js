const bcrypt = require('bcrypt')
const uuid = require('uuid')

const UserModel = require('../models/user-model')
const UserDto = require('../dto/user-dto')
const mailService = require('./mail-service')
const tokenService = require('./token-service')

class UserService {
  async registration (email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw new Error('Exist')
    }

    const hashPass = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await UserModel.create(
      { email, password: hashPass, activationLink })

    await mailService.sendActivationMail(email, activationLink)

    const userDto = new UserDto(model)
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
      throw new Error('User does not exist')
    }

    await UserModel.updateOne({ activationLink }, { isActivated: true })
  }
}

module.exports = new UserService()