const controllers = {}

controllers.get = (req, res) => {
  return res.status(200).json({ healthcheck: 'live' })
}

module.exports = controllers
