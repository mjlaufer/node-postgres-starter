import * as utils from './utils';

describe('model utils', () => {
    test('#generateWhereClause', () => {
        const params = {
            email: 'user@test.com',
            username: 'username',
        };

        expect(utils.generateWhereClause(params)).toBe(
            "WHERE email = 'user@test.com' AND WHERE username = 'username'",
        );
    });
});
