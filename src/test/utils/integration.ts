import got from 'got';
import Knex from 'knex';
import { get, head } from 'lodash';
import validate from 'validator';
import db from '@db';
import * as knexConfig from '@db/knexfile';
import { hash } from '@features/user/user-helpers';
import { redisClient } from '@middleware/session';
import { User, UserEntity } from '@types';
import * as generate from './generate';

const knex = Knex(knexConfig);

export const request = got.extend({
    hooks: {
        beforeError: [
            (error) => {
                const { response } = error;
                if (response && response.body) {
                    error.message = `(${response.statusCode}) ${get(
                        response.body,
                        'message',
                        'Something went wrong.',
                    )}`;
                }
                return error;
            },
        ],
    },
    responseType: 'json',
    retry: 0,
});

export async function resetDb(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
        await knex.seed.run();
    }
}

export async function closeOpenHandles(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
        await db.$pool.end();
        await knex.destroy();
        await new Promise((resolve) => redisClient.quit(resolve));
        await new Promise((resolve) => setImmediate(resolve));
    }
}

export async function authenticate(
    port: string,
    userOverrides?: Partial<UserEntity>,
): Promise<[User, string]> {
    const loginUrl = `http://localhost:${port}/login/`;

    const email = generate.email();
    const password = generate.password();
    const userData: UserEntity = {
        id: generate.id(),
        email: validate.normalizeEmail(email) || email,
        username: generate.username(),
        password: hash(password),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userOverrides,
    };

    let user: User;
    if (userOverrides?.id) {
        user = await db.users.update(userData);
    } else {
        user = await db.users.create(userData);
    }

    const res = await request.post(loginUrl, {
        json: {
            email: userData.email,
            password,
        },
    });

    const cookies = res.headers['set-cookie'];
    const authCookie = head(cookies) ?? '';

    return [user, authCookie];
}
