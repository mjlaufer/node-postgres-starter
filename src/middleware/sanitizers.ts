import { check, body, query, ValidationChain } from 'express-validator';

export const sanitizeEmail = [body('email').normalizeEmail()];

export function sanitizeText(field: string | string[]): ValidationChain[] {
    if (typeof field === 'string') {
        field = [field];
    }

    return field.map((f) => check(f).trim().escape());
}

export const sanitizePaginationOptions = [
    query('limit').optional().toInt(),
    query('lastCreatedAt').optional().toDate(),
    query('order').optional().trim().escape(),
];
