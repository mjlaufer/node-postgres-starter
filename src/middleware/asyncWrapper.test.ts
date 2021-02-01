import * as generate from '@test/utils/generate';
import asyncWrapper from './asyncWrapper';

describe('asyncWrapper', () => {
    const asyncFn = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('creates a middleware', () => {
        expect.assertions(1);

        const middleware = asyncWrapper(asyncFn);

        expect(typeof middleware).toBe('function');
    });

    test('calls the middleware function', async () => {
        expect.assertions(2);

        const middleware = asyncWrapper(asyncFn);
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(asyncFn).toHaveBeenCalledWith(req, res, next);
        expect(asyncFn).toHaveBeenCalledTimes(1);
    });

    test('passes error to next() if unsuccessful', async () => {
        const err = new Error('error');
        const asyncFn = jest.fn().mockRejectedValue(err);

        expect.assertions(2);

        const middleware = asyncWrapper(asyncFn);
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(next).toHaveBeenCalledTimes(1);
    });
});
