import express, { Request, Response } from 'express';
import { CustomError, notFound, errorHandler } from './errors';

describe('CustomError', () => {
    test('can create CustomError objects', () => {
        const error = new CustomError('Not Found', 404);

        expect(error instanceof CustomError).toBe(true);
        expect(error.message).toBe('Not Found');
        expect(error.status).toBe(404);
    });
});

describe('notFound', () => {
    test('calls next with a `Not Found` error', () => {
        const next = jest.fn();
        const notFoundError = new CustomError('Not Found', 404);

        notFound({} as Request, {} as Response, next);

        expect(next).toHaveBeenCalledWith(notFoundError);
    });
});

describe('errorHandler', () => {
    const error = new CustomError('error');
    const next = jest.fn();

    test('returns a middleware function', () => {
        const app = express();
        const middleware = errorHandler(app);
        expect(typeof middleware).toBe('function');
    });

    test('sends stack trace in development', () => {
        const app = express();
        const middleware = errorHandler(app);
        const res: any = {
            send: jest.fn(),
            status: jest.fn(),
        };

        app.set('env', 'development');

        middleware(error, {} as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(error.status);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: error.message,
                stack: error.stack,
            }),
        );
    });

    test('does not send stack trace in production', () => {
        const app = express();
        const middleware = errorHandler(app);
        const res: any = {
            send: jest.fn(),
            status: jest.fn(),
        };

        app.set('env', 'production');

        middleware(error, {} as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(error.status);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: error.message,
            }),
        );
        expect(res.send).not.toHaveBeenCalledWith(
            expect.objectContaining({
                stack: error.stack,
            }),
        );
    });
});
