const index = require('../../../src/controllers/index')

describe('Should test the proper functioning of the index controller.', () => {
  it('Test it the index returns status code 200', () => {
    const req = {}

    const res = {}

    index(req, res)
    expect(res).toBe({ healthcheck: 'live' })
  })
})