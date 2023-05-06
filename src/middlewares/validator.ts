import { plainToClass, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { type NextFunction, type Request, type Response } from 'express';

export const validator = (params: {
    Dto: ClassConstructor<unknown>
}) => async (request: Request, response: Response, next: NextFunction) => {
    const payload = request.method === 'GET' ? request.query : request.body
    const dto = plainToClass(params.Dto, payload)
    const errors = await validate(dto as object)

    if (errors.length) {
        return response.status(400).json({ errors })
    }

    next()
}
