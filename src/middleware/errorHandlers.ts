import { Request, Response, NextFunction } from 'express';
import { HttpError, NotFoundError, HttpErrorMessages } from '@errors';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    const err = new NotFoundError(HttpErrorMessages.NOT_FOUND);
    next(err);
}

export function errorHandler(
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (res.headersSent) {
        return next(err);
    }

    if (process.env.NODE_ENV !== 'production') {
        res.status(err.status).json({
            message: err.message,
            stack: err.stack,
        });
    } else {
        res.status(err.status).json({ message: err.message });
    }
}
