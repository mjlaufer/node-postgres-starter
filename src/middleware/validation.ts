import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import { HttpError } from '../helpers/errors';
import { MiddlewareFunc } from '../types';

export function validateParams(schema: Joi.ObjectSchema): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.params);
            next();
        } catch (err) {
            next(new HttpError(err.message, 400));
        }
    };
}

export function validateBody(schema: Joi.ObjectSchema): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (err) {
            next(new HttpError(err.message, 400));
        }
    };
}
