import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { type User } from '../entities/user';
import { type UserRepository } from '../repositories/user.repository';

import { VerificationsController } from './verifications.controller';

describe(VerificationsController.name, () => {
  let verificationsController: VerificationsController;
  let userRepository: UserRepository;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userRepository = ({
      findOne: vi.fn(),
      update: vi.fn(),
    } as unknown as UserRepository);
    verificationsController = new VerificationsController(userRepository);
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
      vi.mocked(userRepository.findOne).mockResolvedValue(null);

      await verificationsController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 401 if key is wrong', async () => {
      const user = { id: '1', emailVerificationKey: 'other-key' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);

      await verificationsController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Wrong key' });
    });

    it('should return 201 and verify email if key is correct', async () => {
      const user = { id: '1', emailVerificationKey: 'correct-key', isEmailVerified: false } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);

      await verificationsController.create(request, response);

      expect(user.isEmailVerified).toBe(true);
      expect(user.emailVerificationKey).toBe('');
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        isEmailVerified: true,
        emailVerificationKey: '',
      });
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({ success: 'Email verified' });
    });
  });
});
