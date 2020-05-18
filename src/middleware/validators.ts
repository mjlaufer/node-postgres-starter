import { Request, Response, NextFunction } from 'express';
import { partial } from 'lodash';
import Joi from 'joi';
import { HttpError } from '../helpers/errors';
import { MiddlewareFunc } from '../types';

type UserInput = 'query' | 'params' | 'body';

function validate(userInput: UserInput, schema: Joi.ObjectSchema): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req[userInput]);
            next();
        } catch (err) {
            next(new HttpError(err.message, 400));
        }
    };
}

export const validateQuery = partial(validate, 'query');
export const validateParams = partial(validate, 'params');
export const validateBody = partial(validate, 'body');
