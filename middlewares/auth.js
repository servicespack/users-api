const auth = (req, res, next) => {
  console.log('middleware auth')
  next()
}

module.exports = auth
