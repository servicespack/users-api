import type { EntityRepository } from '@mikro-orm/core';
import argon2 from 'argon2';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { User } from '../entities/user';

import { TokensController } from './tokens.controller';

vi.mock('argon2');
vi.mock('jsonwebtoken');

describe('TokensController', () => {
  let tokensController: TokensController;
  let userRepository: EntityRepository<User>;
  let entityManager: any;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    entityManager = {
      flush: vi.fn(),
    };
    userRepository = {
      findOne: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue(entityManager),
    } as unknown as EntityRepository<User>;
    tokensController = new TokensController(userRepository);
    request = {
      body: { username: 'testuser', password: 'password123' },
    } as Request;
    response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
  });

  describe('create', () => {
    it('should return 404 if user is not found', async () => {
      vi.mocked(userRepository.findOne).mockResolvedValue(null);

      await tokensController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 401 if password is incorrect', async () => {
      const user = { username: 'testuser', password: 'hashedpassword' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      vi.mocked(argon2.verify).mockResolvedValue(false);

      await tokensController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });

    it('should return 201 with token if credentials are correct', async () => {
      const user = { id: 'user-id', username: 'testuser', password: 'hashedpassword' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      vi.mocked(argon2.verify).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue('mocked-token' as any);

      await tokensController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        Authorization: 'Bearer mocked-token',
      });
    });
  });
});
