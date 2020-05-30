const jwt = require('jsonwebtoken')

const { TOKEN_PREFIX, TOKEN_SECRET } = process.env

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
    await jwt.verify(token, TOKEN_SECRET)

    return next()
  } catch (error) {
    return response.status(401).json({
      error
    })
  }
}

module.exports = auth
