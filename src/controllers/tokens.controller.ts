import process from 'node:process';

import { verify } from '@node-rs/argon2';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Model } from 'mongoose';

import type { IUser } from '../entities/user';

export class TokensController {
  private readonly TOKEN_SECRET = process.env.TOKEN_SECRET || 'abcdef';

  private readonly TOKEN_EXPIRATION = Number(process.env.TOKEN_EXPIRATION || 60);

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly userModel: Model<IUser>) { }

  create = async (request: Request, response: Response) => {
    const { username, password } = request.body;

    const user = await this.userModel.findOne({ username });

    if (user === null) {
      return response.status(404).json({ error: 'User not found' });
    }

    const correctPassword = await verify(user.password, password);

    if (!correctPassword) {
      return response.status(401).json({ error: 'Invalid password' });
    }

    const payload = {
      iss: 'users-service',
      sub: user.id,
    };

    const token = jwt.sign(payload, this.TOKEN_SECRET, { expiresIn: this.TOKEN_EXPIRATION * 60 });

    return response.status(201).json({
      Authorization: `Bearer ${token}`,
    });
  };
}
