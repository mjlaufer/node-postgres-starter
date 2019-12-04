import { Request, Response } from 'express';
import { HttpError, HttpErrorMessages } from '../../helpers/errors';
import { notFoundHandler, errorHandler } from './errorHandlers';

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
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        res = {} as Response;
        res.send = jest.fn();
        res.status = jest.fn(() => res);
    });

    afterEach(() => {
        delete process.env.NODE_ENV;
    });

    test('sends stack trace in non-production environments', () => {
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
        process.env.NODE_ENV = 'production';

        errorHandler(error, {} as Request, res as Response, next);

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
