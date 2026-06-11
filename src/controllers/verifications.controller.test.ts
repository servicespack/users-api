import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { VerificationsController } from './verifications.controller';

describe(VerificationsController.name, () => {
  let verificationsController: VerificationsController;
  let userModel: any;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userModel = {
      findById: vi.fn(),
    };
    verificationsController = new VerificationsController(userModel);
    request = ({
      body: { user_id: '1', key: 'correct-key' },
    } as Request);
    response = ({
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response);
  });

  describe('create', () => {
    it('should return 404 if user is not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await verificationsController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 401 if key is wrong', async () => {
      const user = { id: '1', emailVerificationKey: 'other-key', save: vi.fn() };
      userModel.findById.mockResolvedValue(user);

      await verificationsController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Wrong key' });
    });

    it('should return 201 and verify email if key is correct', async () => {
      const user = {
        id: '1', emailVerificationKey: 'correct-key', isEmailVerified: false, save: vi.fn(),
      };
      userModel.findById.mockResolvedValue(user);

      await verificationsController.create(request, response);

      expect(user.isEmailVerified).toBe(true);
      expect(user.emailVerificationKey).toBe('');
      expect(user.save).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({ success: 'Email verified' });
    });
  });
});
