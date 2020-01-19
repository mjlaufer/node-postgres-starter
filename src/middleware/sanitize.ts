import { sanitizeBody } from 'express-validator';
import { emailValidator } from '../helpers/validators';

export const sanitizeSignupCredentials = [
    sanitizeBody('email').normalizeEmail(),
    sanitizeBody('username')
        .trim()
        .escape(),
];

export const sanitizeLoginCredentials = sanitizeBody('emailOrUsername').customSanitizer(value => {
    const { error } = emailValidator.validate(value);
    return error ? value.trim().escape() : value.isEmail().normalizeEmail();
});

export const sanitizeUpdateUserInputs = [
    sanitizeBody('email').normalizeEmail(),
    sanitizeBody('username')
        .trim()
        .escape(),
];
