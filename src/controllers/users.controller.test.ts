import { hash, verify } from '@node-rs/argon2';
import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { type User } from '../entities/user';
import { type UserRepository } from '../repositories/user.repository';

import { UsersController } from './users.controller';

vi.mock('@node-rs/argon2');
vi.mock('xss', () => ({ default: (s: string) => s }));
vi.mock('class-transformer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('class-transformer')>();
  return {
    ...actual,
    plainToClass: vi.fn((_, data) => data),
  };
});
vi.mock('node:crypto', () => {
  const randomUUID = () => 'mock-uuid';
  return {
    randomUUID,
    default: { randomUUID },
  };
});

describe(UsersController.name, () => {
  let usersController: UsersController;
  let userRepository: UserRepository;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userRepository = ({
      find: vi.fn(),
      count: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as UserRepository);
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

    it('should pass search string to repository', async () => {
      request.query.search = 'test';
      vi.mocked(userRepository.find).mockResolvedValue([]);
      vi.mocked(userRepository.count).mockResolvedValue(0);

      await usersController.list(request, response);

      expect(userRepository.find).toHaveBeenCalledWith('test', expect.any(Object));
      expect(userRepository.count).toHaveBeenCalledWith('test');
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
      vi.mocked(hash).mockResolvedValue('hashed');

      await usersController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(userRepository.create).toHaveBeenCalled();
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
      request.params = { id: '1' };
      request.body = { name: 'New' };

      await usersController.update(request, response);

      expect(userRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'New' }));
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updatePassword', () => {
    it('should return 401 if current password is wrong', async () => {
      const user = { id: '1', password: 'hashed' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      request.params = { id: '1' };
      request.body = { currentPassword: 'wrong', newPassword: 'new' };
      vi.mocked(verify).mockResolvedValue(false);

      await usersController.updatePassword(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and update password', async () => {
      const user = { id: '1', password: 'hashed' } as User;
      vi.mocked(userRepository.findOne).mockResolvedValue(user);
      request.params = { id: '1' };
      request.body = { currentPassword: 'old', newPassword: 'new' };
      vi.mocked(verify).mockResolvedValue(true);
      vi.mocked(hash).mockResolvedValue('new-hashed');

      await usersController.updatePassword(request, response);

      expect(userRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({ password: 'new-hashed' }));
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
      request.params = { id: '1' };

      await usersController.delete(request, response);

      expect(userRepository.delete).toHaveBeenCalledWith('1');
      expect(response.status).toHaveBeenCalledWith(204);
    });
  });
});
