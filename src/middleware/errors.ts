import { Express, Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
    constructor(message: string, public status: number = 500) {
        super(message);
        this.name = 'CustomError';
    }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    const err = new CustomError('Not Found', 404);
    next(err);
}

export function errorHandler(app: Express) {
    return (err: CustomError, req: Request, res: Response, next: NextFunction) => {
        if (app.get('env') === 'development') {
            res.status(err.status);
            res.send({
                message: err.message,
                stack: err.stack,
            });
        } else {
            res.status(err.status);
            res.send({ message: err.message });
        }
    };
}
