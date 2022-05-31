const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('No auth header')
    }

    const [, accessToken] = authHeader.split(' ')
    if (!accessToken) {
      throw new Error('No user token')
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      throw new Error('Invalid access token')
    }

    req.user = userData
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError(e.message))
  }
}