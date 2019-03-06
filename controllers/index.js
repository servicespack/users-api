const controller = {}

controller.get = (req, res) => {
  return res.status(200).json({ healthcheck: 'live' })
}

module.exports = controller
