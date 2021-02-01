import Joi from 'joi';
import * as generate from '@test/utils/generate';
import { ValidationError } from '@utils/errors';
import { validate } from './validators';

describe('validate', () => {
    const mockSchema = Joi.object({ mockField: Joi.string().min(3) });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('can validate req.params; calls next() on success', async () => {
        const middleware = validate('params', mockSchema);

        expect.assertions(2);

        const req = generate.req({ params: { mockField: 'foo' } });
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('passes Bad Request error to next() if validation fails', async () => {
        const middleware = validate('params', mockSchema);

        expect.assertions(2);

        const req = generate.req({ params: { mockField: 'f' } });
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            new ValidationError('"mockField" length must be at least 3 characters long', 400),
        );
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('can validate req.body; calls next() on success', async () => {
        const middleware = validate('body', mockSchema);

        expect.assertions(2);

        const req = generate.req({ body: { mockField: 'foo' } });
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('passes Bad Request error to next() if validation fails', async () => {
        const middleware = validate('body', mockSchema);

        expect.assertions(2);

        const req = generate.req({ body: { mockField: 'f' } });
        const res = generate.res();
        const next = generate.next();
        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(
            new ValidationError('"mockField" length must be at least 3 characters long', 400),
        );
        expect(next).toHaveBeenCalledTimes(1);
    });
});
