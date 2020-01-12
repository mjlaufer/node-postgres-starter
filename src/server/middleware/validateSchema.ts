import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import { HttpError } from '../../helpers/errors';

export default function validateSchema(schema: Joi.ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (err) {
            next(new HttpError(err.message, 400));
        }
    };
}
