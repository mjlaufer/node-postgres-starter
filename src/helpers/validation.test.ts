import { isEmail } from './validation';

describe('isEmail', () => {
    ['x@y', 'foo@bar', 'foo.bar@baz', 'foo@bar.baz'].forEach(value => {
        it(`returns true for "${value}"`, () => {
            expect(isEmail(value)).toBe(true);
        });
    });

    ['', '@', 'x@', '@y', 'foo', 'foo@', '@foo'].forEach(value => {
        it(`returns false for "${value}"`, () => {
            expect(isEmail(value)).toBe(false);
        });
    });
});
