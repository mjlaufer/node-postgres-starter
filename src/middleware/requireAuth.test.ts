import * as generate from '@test/utils/generate';
import { HttpError } from '@utils/errors';
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
});
