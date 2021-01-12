import { check, body, query, ValidationChain } from 'express-validator';
import { castArray, isString } from 'lodash';

export const sanitizeEmail = [body('email').normalizeEmail()];

export function sanitizeText(field: string | string[]): ValidationChain[] {
    if (isString(field)) {
        field = castArray(field);
    }

    return field.map((f) => check(f).trim().escape());
}

export const sanitizePaginationOptions = [
    query('limit').optional().toInt(),
    query('lastCreatedAt').optional().toDate(),
    query('order').optional().trim().escape(),
];
