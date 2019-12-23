import { Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '../../errors';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    const err = new HttpError(HttpErrorMessages.NOT_FOUND, 404);
    next(err);
}

export function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== 'production') {
        res.status(err.status).send({
            message: err.message,
            stack: err.stack,
        });
    } else {
        let message;

        switch (err.status) {
            case 400:
                message = HttpErrorMessages.BAD_REQUEST;
                break;
            case 404:
                message = HttpErrorMessages.NOT_FOUND;
                break;
            default:
                message = HttpErrorMessages.INTERNAL_SERVER_ERROR;
        }

        res.status(err.status).send({ message });
    }

    next();
}
