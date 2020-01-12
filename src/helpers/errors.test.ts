import { HttpError, HttpErrorMessages } from './errors';

describe('HttpError', () => {
    test('can create HttpError objects', () => {
        const error = new HttpError(HttpErrorMessages.NOT_FOUND, 404);

        expect(error instanceof HttpError).toBe(true);
        expect(error.message).toBe(HttpErrorMessages.NOT_FOUND);
        expect(error.status).toBe(404);
    });
});
