import { InternalServerError, HttpError, HttpErrorMessages } from '.';

describe('InternalServerError', () => {
    test('can create InternalServerError objects', () => {
        const error = new InternalServerError();

        expect(error instanceof Error).toBe(true);
        expect(error instanceof HttpError).toBe(true);
        expect(error instanceof InternalServerError).toBe(true);
        expect(error.message).toBe(HttpErrorMessages.INTERNAL_SERVER_ERROR);
        expect(error.status).toBe(500);
    });
});
