import Joi from '@hapi/joi';

const uuidValidator = Joi.string().guid({ version: 'uuidv4' });

const usernameValidator = Joi.string()
    .alphanum()
    .min(3)
    .max(30);

const emailValidator = Joi.string().email();

const passwordValidator = Joi.string()
    .pattern(/^[\w`~!@#$%^&*()-=+\[\]{},./?]{5,30}$/)
    .required();

export const idSchema = Joi.object({
    id: uuidValidator,
});

export const signupSchema = Joi.object({
    email: emailValidator,
    username: usernameValidator,
    password: passwordValidator,
}).and('username', 'email', 'password');

export const loginSchema = Joi.object({
    email: emailValidator,
    password: passwordValidator,
}).and('email', 'password');

export const updateUserSchema = Joi.object({
    email: emailValidator,
    username: usernameValidator,
});
