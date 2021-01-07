import { Request, Response } from 'express';
import Joi from 'joi';
import { HttpError } from '../helpers/errors';
import { validate } from './validators';

describe('validate', () => {
    let req: Request;
    let res: Response;
    const next = jest.fn();
    const mockSchema = Joi.object({ mockField: Joi.string().min(3) });

    beforeEach(() => {
        jest.resetAllMocks();
        req = {} as Request;
        res = {} as Response;
    });

    test('can validate req.params; calls next() on success', async () => {
        const middleware = validate('params', mockSchema);

        req.params = {
            mockField: 'foo',
        };

        expect.assertions(1);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test('passes Bad Request error to next() if validation fails', async () => {
        const middleware = validate('params', mockSchema);
        req.params = {
            mockField: 'f',
        };

        expect.assertions(1);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            new HttpError('"mockField" length must be at least 3 characters long', 400),
        );
    });

    test('can validate req.body; calls next() on success', async () => {
        const middleware = validate('body', mockSchema);
        req.body = {
            mockField: 'foo',
        };

        expect.assertions(1);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test('passes Bad Request error to next() if validation fails', async () => {
        const middleware = validate('body', mockSchema);
        req.body = {
            mockField: 'f',
        };

        expect.assertions(1);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            new HttpError('"mockField" length must be at least 3 characters long', 400),
        );
    });
});
