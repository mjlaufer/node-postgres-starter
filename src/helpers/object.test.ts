import * as helpers from './object';

describe('object helpers', () => {
    describe('camelCaseKeys', () => {
        test('camel cases keys', () => {
            const obj = {
                foo_bar: 1,
                baz_qux: 2,
            };
            expect(helpers.camelCaseKeys(obj)).toEqual({
                fooBar: 1,
                bazQux: 2,
            });
        });
    });

    describe('snakeCaseKeys', () => {
        test('snake cases keys', () => {
            const obj = {
                fooBar: 1,
                bazQux: 2,
            };
            expect(helpers.snakeCaseKeys(obj)).toEqual({
                foo_bar: 1,
                baz_qux: 2,
            });
        });
    });
});
