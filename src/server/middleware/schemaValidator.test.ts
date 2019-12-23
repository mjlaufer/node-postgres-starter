import { Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '../../errors';
import schemaValidator from './schemaValidator';

describe('schemaValidator', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        next = jest.fn();
    });

    test('calls next() if req.path is not mapped to a schema', async () => {
        expect.assertions(1);

        await schemaValidator(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test('validates /signup req.body', async () => {
        req.path = '/signup';
        req.body = {
            email: 'test@test.com',
            username: 'username',
            password: 'password',
        };

        expect.assertions(1);

        await schemaValidator(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test('validates /login req.body', async () => {
        req.path = '/login';
        req.body = {
            emailOrUsername: 'test@test.com',
            password: 'password',
        };

        expect.assertions(1);

        await schemaValidator(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test('passes Bad Request error to next() if validation fails', async () => {
        req.path = '/login';
        req.body = {
            emailOrUsername: 'test@test.com',
        };

        expect.assertions(1);

        await schemaValidator(req, res, next);

        expect(next).toHaveBeenCalledWith(new HttpError(HttpErrorMessages.BAD_REQUEST, 400));
    });
});
