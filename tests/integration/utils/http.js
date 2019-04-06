const axios = require('axios')

const APP_URL = process.env.APP_URL

const http = axios.create({
  baseURL: APP_URL
})

module.exports = http
