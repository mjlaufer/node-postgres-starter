import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { toString } from 'lodash';
import { BadRequestError } from '@errors';
import asyncWrapper from '@middleware/asyncWrapper';
import { MiddlewareFunc } from '@types';

const uuidValidator = Joi.string().guid({ version: 'uuidv4' });
const usernameValidator = Joi.string().min(3).max(30);
const emailValidator = Joi.string().email();
const passwordValidator = Joi.string()
    .pattern(/^[\w`~!@#$%^&*()-=+\[\]{},./?]{5,30}$/)
    .required();

const paginationSchema = Joi.object({
    limit: Joi.number().max(99),
    lastCreatedAt: Joi.date(),
    order: Joi.string().alphanum().min(3).max(4),
});

const idSchema = Joi.object({
    id: uuidValidator,
});

const loginSchema = Joi.object({
    email: emailValidator,
    password: passwordValidator,
}).and('email', 'password');

const signupSchema = Joi.object({
    email: emailValidator,
    username: usernameValidator,
    password: passwordValidator,
}).and('username', 'email', 'password');

const postUpdateSchema = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
});

const userUpdateSchema = Joi.object({
    email: emailValidator,
    username: usernameValidator,
});

export function validate(
    userInput: 'query' | 'params' | 'body',
    schema: Joi.ObjectSchema,
): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.validateAsync(req[userInput]);
            next();
        } catch (err) {
            const message = err instanceof Error ? err.message : toString(err);
            throw new BadRequestError(message);
        }
    };
}

export const validateIdParam = asyncWrapper(validate('params', idSchema));
export const validateLoginCredentials = asyncWrapper(validate('body', loginSchema));
export const validateSignupCredentials = asyncWrapper(validate('body', signupSchema));
export const validatePaginationQuery = asyncWrapper(validate('query', paginationSchema));
export const validatePostUpdate = asyncWrapper(validate('body', postUpdateSchema));
export const validateUserUpdate = asyncWrapper(validate('body', userUpdateSchema));
