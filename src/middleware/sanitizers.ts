import { body, ValidationChain } from 'express-validator';

export const sanitizeEmail = body('email').normalizeEmail();

export function createTextSanitizer(field: string): ValidationChain {
    return body(field)
        .trim()
        .escape();
}
