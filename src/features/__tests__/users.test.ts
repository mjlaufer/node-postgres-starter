import { has, head, identity, isObject } from 'lodash';
import validate from 'validator';
import { startServer, Server } from '@server';
import * as generate from '@test/utils/generate';
import { request, authenticate, closeOpenHandles, resetDb } from '@test/utils/integration';
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
        const userCreateData = {
            email: generate.email(),
            username: generate.username(),
            password: generate.password(),
        };

        const [, cookie] = await authenticate(port, { role: 'admin' });

        const response: User = await request
            .post(usersUrl, {
                headers: {
                    cookie,
                },
                json: userCreateData,
            })
            .json();

        expect(response).toMatchObject({
            id: 'test_uuid',
            email: validate.normalizeEmail(userCreateData.email),
            username: userCreateData.username,
            role: 'user',
        });
    });

    test('PUT /users/:id', async () => {
        const [user, cookie] = await authenticate(port);
        const userUpdateData = { email: generate.email(), username: generate.username() };

        const response: User = await request
            .put(`${usersUrl}${user.id}`, {
                headers: {
                    cookie,
                },
                json: userUpdateData,
            })
            .json();

        expect(response).toMatchObject({
            id: user.id,
            email: validate.normalizeEmail(userUpdateData.email),
            username: userUpdateData.username,
            role: 'user',
        });
    });

    test('DELETE /users/:id', async () => {
        const [user, cookie] = await authenticate(port);

        const response = await request
            .delete(`${usersUrl}${user.id}`, {
                headers: {
                    cookie,
                },
            })
            .json();

        expect(response).toBe('');

        const err = (await request(`${usersUrl}${user.id}`).json().catch(identity)) as Error;

        // Because `user.id` is dynamic, we need to replace it with a constant, so our snapshot remains consistent.
        const testErr = err.message.replace(user.id, 'GENERATED_USER_ID');
        expect(testErr).toMatchInlineSnapshot(
            `"(404) Could not find user with ID GENERATED_USER_ID"`,
        );
    });
});
