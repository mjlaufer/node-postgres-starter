import got from 'got';
import { isString } from 'lodash';
import { startServer, Server } from '@server';
import { closeOpenHandles, resetDb } from '@test/utils';
import { User } from '@types';

describe('/users', () => {
    let baseUrl: string;
    let server: Server;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        const port = isString(address) ? '0' : address?.port;
        baseUrl = `http://localhost:${port}/users/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('GET /users', async () => {
        const response: { users: User[] } = await got(baseUrl, { retry: 0 }).json();

        for (const user of response.users) {
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('username');
        }
    });

    test('GET /users/:id', async () => {
        const userId = 'b9a75c4e-ff61-406b-95a6-6313d55c39fe';
        const response: User = await got(`${baseUrl}${userId}`, { retry: 0 }).json();

        expect(response).toEqual(
            expect.objectContaining({
                id: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                email: 'user1@example.com',
                username: 'user1',
            }),
        );
    });

    test('POST /users', async () => {
        const response: User = await got
            .post(baseUrl, {
                json: { email: 'newuser@example.com', username: 'newuser', password: 'password' },
                retry: 0,
            })
            .json();

        expect(response).toEqual(
            expect.objectContaining({
                email: 'newuser@example.com',
                username: 'newuser',
            }),
        );
    });

    test('PUT /users/:id', async () => {
        const userId = 'b9a75c4e-ff61-406b-95a6-6313d55c39fe';
        const response: User = await got
            .put(`${baseUrl}${userId}`, {
                json: { email: 'updateduser@test.com', username: 'updateduser' },
                retry: 0,
            })
            .json();

        expect(response).toEqual(
            expect.objectContaining({
                id: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                email: 'updateduser@test.com',
                username: 'updateduser',
            }),
        );
    });

    test('DELETE /users/:id', async () => {
        const userId = 'b9a75c4e-ff61-406b-95a6-6313d55c39fe';
        const response = await got.delete(`${baseUrl}${userId}`, { retry: 0 }).json();

        expect(response).toBe('');

        await got(`${baseUrl}${userId}`, { retry: 0 })
            .json()
            .catch((err) => {
                expect(err).toMatchInlineSnapshot(`[HTTPError: Response code 404 (Not Found)]`);
            });
    });
});
