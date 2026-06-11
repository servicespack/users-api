import { hash, verify } from '@node-rs/argon2';
import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';

import { UsersController } from './users.controller';

vi.mock('@node-rs/argon2');
vi.mock('xss', () => ({ default: (s: string) => s }));
vi.mock('node:crypto', () => ({ default: { randomUUID: () => 'mock-uuid' } }));

describe(UsersController.name, () => {
  let usersController: UsersController;
  let userModel: any;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    userModel = {
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
      countDocuments: vi.fn().mockResolvedValue(0),
      findById: vi.fn(),
      findByIdAndDelete: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
    };
    usersController = new UsersController(userModel);
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
      userModel.findById.mockResolvedValue(null);

      await usersController.show(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 if user found', async () => {
      const user = { id: '1' };
      userModel.findById.mockResolvedValue(user);

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
      userModel.create.mockResolvedValue({ id: '1', name: 'Name' });

      await usersController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(userModel.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should return 404 if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await usersController.update(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 and update user', async () => {
      const user = { id: '1', name: 'Old', save: vi.fn() };
      userModel.findById.mockResolvedValue(user);
      request.body = { name: 'New' };

      await usersController.update(request, response);

      expect(user.name).toBe('New');
      expect(user.save).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updatePassword', () => {
    it('should return 401 if current password is wrong', async () => {
      const user = { id: '1', password: 'hashed', save: vi.fn() };
      userModel.findById.mockResolvedValue(user);
      request.body = { currentPassword: 'wrong', newPassword: 'new' };
      vi.mocked(verify).mockResolvedValue(false);

      await usersController.updatePassword(request, response);

      expect(response.status).toHaveBeenCalledWith(401);
    });

    it('should return 200 and update password', async () => {
      const user = { id: '1', password: 'hashed', save: vi.fn() };
      userModel.findById.mockResolvedValue(user);
      request.body = { currentPassword: 'old', newPassword: 'new' };
      vi.mocked(verify).mockResolvedValue(true);
      vi.mocked(hash).mockResolvedValue('new-hashed');

      await usersController.updatePassword(request, response);

      expect(user.password).toBe('new-hashed');
      expect(user.save).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete', () => {
    it('should return 404 if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await usersController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it('should return 204 and delete user', async () => {
      const user = { _id: 'object-id-1', id: '1' };
      userModel.findById.mockResolvedValue(user);
      userModel.findByIdAndDelete.mockResolvedValue(user);

      await usersController.delete(request, response);

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('object-id-1');
      expect(response.status).toHaveBeenCalledWith(204);
    });
  });
});
