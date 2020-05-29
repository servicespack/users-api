const controllers = {}

controllers.patch = (_, response) => {
  return response.status(201).json({ hello: 'world' })
}

module.exports = controllers
