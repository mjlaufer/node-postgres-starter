import * as generate from '@test/utils/generate';
import { HttpError } from '@errors';
import requireAuth from './requireAuth';

describe('requireAuth', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('not logged in', () => {
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();
        const err = new HttpError('Authentication required', 401);

        void requireAuth('user')(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('logged in; role does not have sufficient permissions', () => {
        const req = generate.req({
            user: generate.user(),
        });
        const res = generate.res();
        const next = generate.next();
        const err = new HttpError('Forbidden', 403);

        void requireAuth('admin')(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('logged in; role matches', () => {
        const req = generate.req({
            user: generate.user({ role: 'admin' }),
        });
        const res = generate.res();
        const next = generate.next();

        void requireAuth('admin')(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
