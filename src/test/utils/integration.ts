import got from 'got';
import Knex from 'knex';
import { get, head } from 'lodash';
import validate from 'validator';
import db from '@db';
import * as knexConfig from '@db/knexfile';
import { hash } from '@helpers/user';
import { redisClient } from '@middleware/session';
import { Role } from '@types';
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

export async function getAdminCookie(port: string) {
    const loginUrl = `http://localhost:${port}/login/`;

    const email = generate.email();
    const password = generate.password();
    const adminCreateData = {
        id: generate.id(),
        email: validate.normalizeEmail(email) || generate.email(),
        username: generate.username(),
        password: hash(password),
        role: 'admin' as Role,
    };

    await db.users.create(adminCreateData);

    const res = await request.post(loginUrl, {
        json: {
            email: adminCreateData.email,
            password,
        },
    });

    const cookies = res.headers['set-cookie'];
    return head(cookies);
}

export async function getUserCookie(port: string) {
    const loginUrl = `http://localhost:${port}/login/`;

    const email = generate.email();
    const password = generate.password();
    const userCreateData = {
        id: generate.id(),
        email: validate.normalizeEmail(email) || generate.email(),
        username: generate.username(),
        password: hash(password),
        role: 'user' as Role,
    };

    await db.users.create(userCreateData);

    const res = await request.post(loginUrl, {
        json: {
            email: userCreateData.email,
            password,
        },
    });

    const cookies = res.headers['set-cookie'];
    return head(cookies);
}
