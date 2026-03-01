import type { Request, Response } from 'express';

import { type UserRepository } from '../repositories/user.repository';

export class VerificationsController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly userRepository: UserRepository) { }

  create = async (request: Request, response: Response) => {
    const { user_id: userId, key } = request.body;

    const user = await this.userRepository.findOne({ id: userId });

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

    await this.userRepository.update(user.id, {
      isEmailVerified: user.isEmailVerified,
      emailVerificationKey: user.emailVerificationKey,
    });

    return response.status(201).json({
      success: 'Email verified',
    });
  };
}
