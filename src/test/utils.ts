import got from 'got';
import Knex from 'knex';
import db from '@db';
import * as knexConfig from '@db/knexfile';
import { redisClient } from '@middleware/session';

export * as generate from './generate';

export const knex = Knex(knexConfig);

export const apiClient = got.extend({
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
