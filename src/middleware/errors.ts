import { Express, Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '../helpers/errors';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    const err = new HttpError(HttpErrorMessages.NOT_FOUND, 404);
    next(err);
}

export function errorHandler(app: Express) {
    return (err: HttpError, req: Request, res: Response, next: NextFunction) => {
        if (app.get('env') === 'development') {
            res.status(err.status).send({
                message: err.message,
                stack: err.stack,
            });
        } else {
            let message;

            switch (err.status) {
                case 404:
                    message = HttpErrorMessages.NOT_FOUND;
                    break;
                default:
                    message = HttpErrorMessages.INTERNAL_SERVER_ERROR;
            }

            res.status(err.status).send({ message });
        }

        next();
    };
}
