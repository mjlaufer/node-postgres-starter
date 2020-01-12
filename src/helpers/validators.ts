import Joi from '@hapi/joi';

export const usernameValidator = Joi.string()
    .alphanum()
    .min(3)
    .max(30);

export const emailValidator = Joi.string().email();

export const passwordValidator = Joi.string()
    .pattern(/^[\w`~!@#$%^&*()-=+\[\]{},./?]{5,30}$/)
    .required();
