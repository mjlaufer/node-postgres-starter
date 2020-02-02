import { sanitizeBody, SanitizationChain } from 'express-validator';

export const sanitizeEmail = sanitizeBody('email').normalizeEmail();

export function createTextSanitizer(field: string): SanitizationChain {
    return sanitizeBody(field)
        .trim()
        .escape();
}
