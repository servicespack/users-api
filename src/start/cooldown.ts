import http from 'node:http'
import { type Connection } from "mongoose"

const cooldown = ({ server, db }: {
  db: Connection,
  server: http.Server
}) => {
  const close = (code: number) => () => {
    server.close(() => {
      db.close()
      process.exit(code)
    })
  }

  process.on('SIGHUP', close(128 + 1))
  process.on('SIGINT', close(128 + 2))
  process.on('SIGTERM', close(128 + 15))
}

export default cooldown
