import { Request, Response, NextFunction } from 'express';
import { castArray, get } from 'lodash';
import { MiddlewareFunc, Role } from '@types';
import { HttpError, HttpErrorMessages } from '@utils/errors';

export default function requireAuth(roles: Role[] | Role): MiddlewareFunc {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            const err = new HttpError('Authentication required', 401);
            return next(err);
        }

        const allowedRoles = ['admin', ...castArray(roles)];
        const userRole = get(req.user, 'role');

        if (!allowedRoles.includes(userRole)) {
            const err = new HttpError(HttpErrorMessages.FORBIDDEN, 403);
            return next(err);
        }

        next();
    };
}
