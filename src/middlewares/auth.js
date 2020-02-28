const jwt = require('jsonwebtoken')

const TOKEN_PREFIX = process.env.TOKEN_PREFIX
const TOKEN_SECRET = process.env.TOKEN_SECRET

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({
      error: 'No token provided'
    })
  }

  const [prefix, token] = authorization.split(' ')

  if (prefix !== TOKEN_PREFIX) {
    return res.status(401).json({
      error: 'Invalid prefix'
    })
  }

  try {
    await jwt.verify(token, TOKEN_SECRET)

    return next()
  } catch (error) {
    return res.status(401).json({
      error
    })
  }
}

module.exports = auth
