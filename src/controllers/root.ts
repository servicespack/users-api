import { type Request, type Response } from 'express'

export default {
  get: (_request: Request, response: Response) => {
    return response.status(200).json({ healthcheck: 'live' })
  }
}
