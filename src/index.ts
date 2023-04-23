import { cooldown, orm } from './start'
import app from './app'

const { APP_PORT } = process.env

const server = app.listen(APP_PORT, () => {
  console.log(`[index.js: Listening on ${APP_PORT}]`)
})

cooldown({ server, orm })

export default {
  async turnOff () {
    await orm.close()
    server.close()
  }
}
