const controller = {}

controller.get = (req, res) => {
  console.log('GET /')
  res.send('UBox - A simple and intuitive users API')
}

module.exports = controller
