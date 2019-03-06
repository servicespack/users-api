const jwt = require('jsonwebtoken')

const secret = process.env.SECRET

const auth = (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({
      authenticated: 'false',
      error: 'No token provided'
    })
  }

  jwt.verify(authorization, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ authenticated: 'false', error: err })
    }

    return next()
  })
}

module.exports = auth
