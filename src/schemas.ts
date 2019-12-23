import Joi from '@hapi/joi';

const usernameValidator = Joi.string()
    .alphanum()
    .min(3)
    .max(30);

export const emailValidator = Joi.string().email();

const passwordValidator = Joi.string()
    .pattern(/^[\w`~!@#$%^&*()-=+\[\]{},./?]{5,30}$/)
    .required();

const signupSchema = Joi.object({
    username: usernameValidator,
    email: emailValidator,
    password: passwordValidator,
}).and('username', 'email', 'password');

const loginSchema = Joi.object({
    emailOrUsername: Joi.alternatives().try(usernameValidator, emailValidator),
    password: passwordValidator,
}).and('emailOrUsername', 'password');

export interface SchemaMap {
    [route: string]: Joi.ObjectSchema;
}

const schemaMap: SchemaMap = {
    '/signup': signupSchema,
    '/login': loginSchema,
};

export default schemaMap;
