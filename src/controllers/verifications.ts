import type { Request, Response } from 'express';

import { User } from '../entities/user';
import { orm } from '../start/database';

const userRepository = orm.em.getRepository(User);

export default {
  create: async (request: Request, response: Response) => {
    const { user_id: userId, type, key } = request.body;

    const user = await userRepository
      .findOne(userId);

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      });
    }

    if (key === user.emailVerificationKey) {
      user.isEmailVerified = true;
      user.emailVerificationKey = '';
    } else {
      return response.status(401).json({
        error: 'Wrong key',
      });
    }

    await userRepository.flush();

    return response.status(201).json({
      success: 'Email verified',
    });
  },
};
