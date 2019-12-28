import { Request, Response } from 'express';
import asyncWrapper from './asyncWrapper';

describe('asyncWrapper', () => {
    const req = {} as Request;
    const res = {} as Response;
    res.json = jest.fn();
    const next = jest.fn();
    const asyncFn = jest.fn();

    test('creates a middleware', () => {
        expect.assertions(1);

        const middleware = asyncWrapper(asyncFn);

        expect(typeof middleware).toBe('function');
    });

    test('calls the middleware function', async () => {
        expect.assertions(1);

        const middleware = asyncWrapper(asyncFn);
        await middleware(req, res, next);

        expect(asyncFn).toHaveBeenCalledWith(req, res, next);
    });

    test('passes error to next() if unsuccessful', async () => {
        const err = new Error('error');
        const asyncFn = jest.fn().mockRejectedValue(err);

        expect.assertions(1);

        const middleware = asyncWrapper(asyncFn);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
    });
});
