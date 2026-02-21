import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi,
} from 'vitest';

import { RootController } from './root.controller';

describe('RootController', () => {
  it('should return 200 with healthcheck live', () => {
    const rootController = new RootController();
    const request = {} as Request;
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    rootController.get(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ healthcheck: 'live' });
  });
});
