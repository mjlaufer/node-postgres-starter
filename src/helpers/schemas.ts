import Joi from '@hapi/joi';
import * as validators from './validators';

export const idSchema = Joi.object({
    id: validators.uuidValidator,
});

export const signupSchema = Joi.object({
    email: validators.emailValidator,
    username: validators.usernameValidator,
    password: validators.passwordValidator,
}).and('username', 'email', 'password');

export const loginSchema = Joi.object({
    email: validators.emailValidator,
    password: validators.passwordValidator,
}).and('email', 'password');

export const updateUserSchema = Joi.object({
    email: validators.emailValidator,
    username: validators.usernameValidator,
});
