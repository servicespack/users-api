const controller = {}

controller.get = (req, res) => {
  console.log('GET /')
  res.status(200)
  res.json({ healthcheck: 'live' })
}

module.exports = controller
