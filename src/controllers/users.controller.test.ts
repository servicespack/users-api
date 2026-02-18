import type { EntityRepository, EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { User } from '../entities/user';

import { UsersController } from './users.controller';

vi.mock('bcryptjs');
vi.mock('xss', () => ({ default: (s: string) => s }));
vi.mock('class-transformer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('class-transformer')>();
  return {
    ...actual,
    plainToClass: vi.fn((_, data) => data),
  };
});
vi.mock('node:crypto', () => ({ default: { randomUUID: () => 'mock-uuid' } }));

describe('UsersController', () => {
  let usersController: UsersController;
  let userRepository: EntityRepository<User>;
  let entityManager: EntityManager;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    entityManager = ({
      persistAndFlush: vi.fn(),
      flush: vi.fn(),
    } as unknown as EntityManager);
    userRepository = ({
      find: vi.fn(),
      count: vi.fn(),
      findOne: vi.fn(),
      nativeDelete: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue(entityManager),
    } as unknown as EntityRepository<User>);
    usersController = new UsersController(userRepository);
    request = ({
      query: {},
      params: {},
      body: {},
    } as unknown as Request);
    response = ({
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response);
  });

  describe('list', () => {
    it('should return 400 if search is unsafe', async () => {
      request.query.search = '(a+)+$'; // Truly unsafe regex for safe-regex

      await usersController.list(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
    });

    it('should return 200 with list of users', async () => {
      vi.mocked(userRepository.find).mockResolvedValue([]);
      vi.mocked(userRepository.count).mockResolvedValue(0);

      await usersController.list(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
        meta: expect.any(Object),
        data: [],
      }));
    });
  });

  describe('show', () => {
    it('should return 404 if user not found', async () => {
      vi.mocked(userRepository.findOne).mockResolvedValue(null);

      await usersController.show(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 if user found', async () => {
      const user = { id: '1' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);

      await usersController.show(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(user);
    });
  });

  describe('create', () => {
    it('should return 201 and create user', async () => {
      request.body = {
        name: 'Name', email: 'email@test.com', username: 'user', password: 'password',
      };
      vi.mocked(bcrypt.hashSync).mockReturnValue('hashed' as any);

      await usersController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(entityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should return 404 if user not found', async () => {
      vi.mocked(userRepository.findOne).mockResolvedValue(null);

      await usersController.update(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 and update user', async () => {
      const user = { id: '1', name: 'Old' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      request.body = { name: 'New' };

      await usersController.update(request, response);

      expect(user.name).toBe('New');
      expect(entityManager.flush).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updatePassword', () => {
    it('should return 401 if current password is wrong', async () => {
      const user = { id: '1', password: 'hashed' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      request.body = { currentPassword: 'wrong', newPassword: 'new' };
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await usersController.updatePassword(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and update password', async () => {
      const user = { id: '1', password: 'hashed' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      request.body = { currentPassword: 'old', newPassword: 'new' };
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hashSync).mockReturnValue('new-hashed' as any);

      await usersController.updatePassword(request, response);

      expect(user.password).toBe('new-hashed');
      expect(entityManager.flush).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete', () => {
    it('should return 404 if user not found', async () => {
      vi.mocked(userRepository.findOne).mockResolvedValue(null);

      await usersController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 204 and delete user', async () => {
      const user = { id: '1' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);

      await usersController.delete(request, response);

      expect(userRepository.nativeDelete).toHaveBeenCalledWith(user);
      expect(response.status).toHaveBeenCalledWith(204);
    });
  });
});
