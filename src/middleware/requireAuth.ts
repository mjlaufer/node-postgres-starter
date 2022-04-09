import { Request, Response, NextFunction } from 'express';
import { castArray, get } from 'lodash';
import { MiddlewareFunc, Role } from '@types';
import { UnauthorizedError, ForbiddenError } from '@errors';

export default function requireAuth(roles: Role[] | Role): MiddlewareFunc {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            const err = new UnauthorizedError();
            return next(err);
        }

        const allowedRoles = ['admin', ...castArray(roles)];
        const userRole = get(req.user, 'role');

        if (!allowedRoles.includes(userRole)) {
            const err = new ForbiddenError();
            return next(err);
        }

        next();
    };
}
