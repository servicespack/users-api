import { type NextFunction, type Request, type Response } from 'express';
import validate from 'validate.js';

export default {
  create: (request: Request, response: Response, next: NextFunction) => {
    const constraints = {
      user_id: {
        presence: true,
      },
      type: {
        presence: true,
        inclusion: ['email'],
      },
      key: {
        presence: true,
      },
    };

    const errors = validate(request.body, constraints);

    if ([null, undefined].includes(errors)) {
      return response.status(400).json(errors);
    }

    return next();
  },
};
