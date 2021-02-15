import { Response } from 'got';
import { head, identity, isString, pick } from 'lodash';
import validate from 'validator';
import { startServer, Server } from '@server';
import * as generate from '@test/utils/generate';
import { request, closeOpenHandles, resetDb } from '@test/utils/integration';
import { User } from '@types';

jest.mock('uuid', () => ({
    v4: () => 'test_uuid',
}));

const getCookies = (res: Response) => res.headers['set-cookie'];

describe('auth routes', () => {
    let baseUrl: string;
    let server: Server;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        const port = isString(address) ? '0' : address?.port;
        baseUrl = `http://localhost:${port}/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('auth flow', async () => {
        const testData = {
            email: generate.email(),
            username: generate.username(),
            password: generate.password(),
        };

        // Sign up
        const signupRes = await request.post(`${baseUrl}signup/`, {
            json: testData,
        });

        expect(signupRes.body).toEqual({ isAuthenticated: true });

        // Check current user
        let user: User = await request(`${baseUrl}current-user/`, {
            headers: {
                cookie: head(getCookies(signupRes)),
            },
        }).json();

        expect(user).toEqual(
            expect.objectContaining({
                id: 'test_uuid',
                email: validate.normalizeEmail(testData.email),
                username: testData.username,
            }),
        );

        // Log out
        const logoutRes = await request(`${baseUrl}logout/`);
        expect(head(logoutRes.redirectUrls)).toBe(`${baseUrl}`);

        // Check current user
        const err = await request(`${baseUrl}current-user/`).json().catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: Response code 401 (Unauthorized)]`);

        // Log in
        const loginRes = await request.post(`${baseUrl}login/`, {
            json: pick(testData, ['email', 'password']),
        });

        expect(loginRes.body).toEqual({ isAuthenticated: true });

        // Check current user
        user = await request(`${baseUrl}current-user/`, {
            headers: {
                cookie: head(getCookies(loginRes)),
            },
        }).json();

        expect(user).toEqual(
            expect.objectContaining({
                id: 'test_uuid',
                email: validate.normalizeEmail(testData.email),
                username: testData.username,
            }),
        );
    });

    test('signup: email is not unique', async () => {
        const response = await request
            .post(`${baseUrl}signup/`, {
                json: {
                    email: 'user1@example.com',
                    username: generate.username(),
                    password: generate.password(),
                },
            })
            .json();
        expect(response).toEqual({
            isAuthenticated: false,
            message: 'An account for this email already exists',
        });
    });

    test('signup: email not provided', async () => {
        const err = await request
            .post(`${baseUrl}signup/`, {
                json: { username: generate.username(), password: generate.password() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: (400) "email" must be a valid email]`);
    });

    test('signup: username not provided', async () => {
        const err = await request
            .post(`${baseUrl}signup/`, {
                json: { email: generate.email(), password: generate.password() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(
            `[HTTPError: (400) "username" is not allowed to be empty]`,
        );
    });

    test('signup: password not provided', async () => {
        const err = await request
            .post(`${baseUrl}signup/`, {
                json: { email: generate.email(), username: generate.username() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: (400) "password" is required]`);
    });

    test('login: email not provided', async () => {
        const err = await request
            .post(`${baseUrl}login/`, {
                json: { username: generate.username(), password: generate.password() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: (400) "email" must be a valid email]`);
    });

    test('login: password not provided', async () => {
        const err = await request
            .post(`${baseUrl}login/`, {
                json: { email: generate.email(), username: generate.username() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: (400) "password" is required]`);
    });

    test('login: user does not exist', async () => {
        const err = await request
            .post(`${baseUrl}login/`, {
                json: { email: generate.email(), password: generate.password() },
            })
            .json()
            .catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: (401) Something went wrong.]`);
    });
});
