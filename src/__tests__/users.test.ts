import { has, head, identity, isObject } from 'lodash';
import validate from 'validator';
import { startServer, Server } from '@server';
import * as generate from '@test/utils/generate';
import { request, getAdminCookie, closeOpenHandles, resetDb } from '@test/utils/integration';
import { User } from '@types';

jest.mock('uuid', () => ({
    v4: () => 'test_uuid',
}));

describe('/users', () => {
    let server: Server;
    let port = '0';
    let usersUrl: string;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        port = isObject(address) && has(address, 'port') ? String(address.port) : port;
        usersUrl = `http://localhost:${port}/users/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('GET /users', async () => {
        const response: { users: User[] } = await request(usersUrl).json();

        for (const user of response.users) {
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('username');
        }
    });

    test('GET /users/:id', async () => {
        const { users }: { users: User[] } = await request(usersUrl).json();
        const firstUser = head(users) as User;

        const response: User = await request(`${usersUrl}${firstUser.id}`).json();

        expect(response).toMatchObject(firstUser);
    });

    test('POST /users', async () => {
        const testUserCreateData = {
            email: generate.email(),
            username: generate.username(),
            password: generate.password(),
        };

        const response: User = await request
            .post(usersUrl, {
                headers: {
                    cookie: await getAdminCookie(port),
                },
                json: testUserCreateData,
            })
            .json();

        expect(response).toMatchObject({
            id: 'test_uuid',
            email: validate.normalizeEmail(testUserCreateData.email),
            username: testUserCreateData.username,
            role: 'user',
        });
    });

    test('PUT /users/:id', async () => {
        const { users }: { users: User[] } = await request(usersUrl).json();
        const firstUser = head(users) as User;

        const testUserUpdateData = { email: generate.email(), username: generate.username() };

        const response: User = await request
            .put(`${usersUrl}${firstUser.id}`, {
                headers: {
                    cookie: await getAdminCookie(port),
                },
                json: testUserUpdateData,
            })
            .json();

        expect(response).toMatchObject({
            id: firstUser.id,
            email: validate.normalizeEmail(testUserUpdateData.email),
            username: testUserUpdateData.username,
            role: 'user',
        });
    });

    test('DELETE /users/:id', async () => {
        const { users }: { users: User[] } = await request(usersUrl).json();
        const firstUser = head(users) as User;

        const response = await request
            .delete(`${usersUrl}${firstUser.id}`, {
                headers: {
                    cookie: await getAdminCookie(port),
                },
            })
            .json();

        expect(response).toBe('');

        const err = (await request(`${usersUrl}${firstUser.id}`).json().catch(identity)) as Error;

        // Because `firstUser.id` is dynamic, we need to replace it with a constant, so our snapshot remains consistent.
        const testErr = err.message.replace(firstUser.id, 'GENERATED_USER_ID');
        expect(testErr).toMatchInlineSnapshot(`
            "(404) QueryResultError {
                code: queryResultErrorCode.noData
                message: \\"No data returned from the query.\\"
                received: 0
                query: \\"SELECT u.id, u.email, u.username, u.password, u.created_at, u.updated_at, r.name as role FROM users u INNER JOIN roles r ON r.id = u.role_id WHERE u.id = 'GENERATED_USER_ID'\\"
            }"
        `);
    });
});
