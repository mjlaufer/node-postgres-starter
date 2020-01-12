import * as helpers from './helpers';

describe('db helpers', () => {
    test('#generateWhereClause', () => {
        const params = {
            email: 'user@test.com',
            username: 'username',
        };

        expect(helpers.generateWhereClause(params)).toBe(
            "WHERE email = 'user@test.com' AND WHERE username = 'username'",
        );
    });
});
