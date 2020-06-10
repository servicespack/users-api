const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const { TOKEN_PREFIX, TOKEN_SECRET } = process.env

const User = mongoose.model('User')

const auth = async (request, response, next) => {
  const authorization = request.headers.authorization

  if (!authorization) {
    return response.status(401).json({
      error: 'No token provided'
    })
  }

  const [prefix, token] = authorization.split(' ')

  if (prefix !== TOKEN_PREFIX) {
    return response.status(401).json({
      error: 'Invalid prefix'
    })
  }

  try {
    const { sub: id } = jwt.verify(token, TOKEN_SECRET)

    const user = await User.findById(id)

    if (!user) {
      return response.status(401).json({
        error: 'Token\'s user doesn\'t exist'
      })
    }

    return next()
  } catch (error) {
    return response.status(401).json({
      error
    })
  }
}

module.exports = auth
