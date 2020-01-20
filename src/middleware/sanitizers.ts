import { sanitizeBody } from 'express-validator';

export const sanitizeEmail = sanitizeBody('email').normalizeEmail();

export const sanitizeUsername = sanitizeBody('username')
    .trim()
    .escape();
