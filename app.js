const bodyParser = require('body-parser')
const express = require('express')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

module.exports = app