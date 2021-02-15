import { Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '@utils/errors';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    const err = new HttpError(HttpErrorMessages.NOT_FOUND, 404);
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
        let message;

        switch (err.status) {
            case 400:
                message = HttpErrorMessages.BAD_REQUEST;
                break;
            case 401:
                message = HttpErrorMessages.UNAUTHORIZED;
                break;
            case 403:
                message = HttpErrorMessages.FORBIDDEN;
                break;
            case 404:
                message = HttpErrorMessages.NOT_FOUND;
                break;
            default:
                message = HttpErrorMessages.INTERNAL_SERVER_ERROR;
        }

        res.status(err.status).json({ message });
    }
}
