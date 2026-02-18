import type { Request, Response } from 'express';

export class RootController {
  get = (_request: Request, response: Response) => response.status(200).json({ healthcheck: 'live' });
}
