import * as generate from '@test/utils/generate';
import { NotFoundError, InternalServerError } from '@errors';
import { notFoundHandler, errorHandler } from './errorHandlers';

describe('notFoundHandler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('calls next with a `Not Found` error', () => {
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        const notFoundError = new NotFoundError();

        notFoundHandler(req, res, next);

        expect(next).toHaveBeenCalledWith(notFoundError);
        expect(next).toHaveBeenCalledTimes(1);
    });
});

describe('errorHandler', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        delete process.env.NODE_ENV;
    });

    test('calls next if headersSent is true', () => {
        const err = new InternalServerError();
        const req = generate.req();
        const res = generate.res({ headersSent: true });
        const next = generate.next();
        errorHandler(err, req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('sends stack trace in non-production environments', () => {
        const err = new InternalServerError();
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(err.status);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            message: err.message,
            stack: err.stack,
        });
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();
    });

    test('does not send stack trace in production', () => {
        process.env.NODE_ENV = 'production';

        const err = new InternalServerError();
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(err.status);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            message: err.message,
        });
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).not.toHaveBeenCalledWith(
            expect.objectContaining({
                stack: err.stack,
            }),
        );
        expect(next).not.toHaveBeenCalled();
    });
});
