const jwt = require('jsonwebtoken')

const TokenModel = require('../models/token-model')

class TokenService {
  generateTokens (payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,
      { expires: '30m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,
      { expires: '30d' })

    return {
      accessToken, refreshToken,
    }
  }

  async saveToken (userId, refreshToken) {
    const tokenData = await TokenModel.findOne(({ userId }))
    if (tokenData) {
      tokenData.refreshToken = refreshToken

      return tokenData.save()
    }

    const token = await TokenModel.create({ userId, refreshToken })

    return token
  }
}

module.exports = new TokenService()