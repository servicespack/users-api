require('./db')
const app = require('./app')

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('[index.js: Listening on ' + port + ']')
})
