import type { EntityManager } from '@mikro-orm/core';
import type { Request, Response } from 'express';

import { User } from '../entities/user';

export class VerificationsController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly em: EntityManager) { }

  create = async (request: Request, response: Response) => {
    const { user_id: userId, key } = request.body;

    const user = await this.em.findOne(User, { id: userId });

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

    await this.em.flush();

    return response.status(201).json({
      success: 'Email verified',
    });
  };
}
