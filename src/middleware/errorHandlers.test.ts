import express, { Express, Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '../helpers/errors';
import { notFoundHandler, errorHandler } from './errorHandlers';

type ErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => void;

describe('notFoundHandler', () => {
    test('calls next with a `Not Found` error', () => {
        const next = jest.fn();
        const notFoundError = new HttpError(HttpErrorMessages.NOT_FOUND, 404);

        notFoundHandler({} as Request, {} as Response, next);

        expect(next).toHaveBeenCalledWith(notFoundError);
    });
});

describe('errorHandler', () => {
    const error = new HttpError('error');
    let app: Express;
    let middleware: ErrorHandler;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        app = express();
        res = {} as Response;
        res.send = jest.fn();
        res.status = jest.fn(() => res);
    });

    test('sends stack trace in development', () => {
        app.set('env', 'development');

        errorHandler(error, {} as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(error.status);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: error.message,
                stack: error.stack,
            }),
        );
    });

    test('does not send stack trace in production', () => {
        app.set('env', 'production');

        middleware(error, {} as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(error.status);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: HttpErrorMessages.INTERNAL_SERVER_ERROR,
            }),
        );
        expect(res.send).not.toHaveBeenCalledWith(
            expect.objectContaining({
                stack: error.stack,
            }),
        );
    });
});
