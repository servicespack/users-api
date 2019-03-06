const jwt = require('jsonwebtoken')

const TOKEN_PREFIX = process.env.TOKEN_PREFIX
const TOKEN_SECRET = process.env.TOKEN_SECRET

const auth = (req, res, next) => {
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

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ authenticated: 'false', error: err })
    }

    return next()
  })
}

module.exports = auth
