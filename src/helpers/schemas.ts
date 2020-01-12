import Joi from '@hapi/joi';
import * as validators from './validators';

export const signupSchema = Joi.object({
    username: validators.usernameValidator,
    email: validators.emailValidator,
    password: validators.passwordValidator,
}).and('username', 'email', 'password');

export const loginSchema = Joi.object({
    emailOrUsername: Joi.alternatives().try(
        validators.usernameValidator,
        validators.emailValidator,
    ),
    password: validators.passwordValidator,
}).and('emailOrUsername', 'password');

export const updateUserSchema = Joi.object({
    username: validators.usernameValidator,
    email: validators.emailValidator,
});
