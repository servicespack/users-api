import type { EntityRepository } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../entities/user';

export class TokensController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly userRepository: EntityRepository<User>) { }

  create = async (request: Request, response: Response) => {
    const {
      TOKEN_SECRET = 'abcdef',
      TOKEN_EXPIRATION = 60,
    } = process.env;

    const { username, password } = request.body;

    const user = await this.userRepository.findOne({ username });

    if (user === null) {
      return response.status(404).json({ error: 'User not found' });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid password' });
    }

    const payload = {
      iss: 'users-service',
      sub: user.id,
    };

    const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: Number(TOKEN_EXPIRATION) * 60 });

    return response.status(201).json({
      Authorization: `Bearer ${token}`,
    });
  };
}
