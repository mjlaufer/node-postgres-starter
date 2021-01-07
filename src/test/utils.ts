import Knex from 'knex';
import * as knexConfig from '../knexfile';
import { db } from '../db';
import { redisClient } from '../middleware/session';

export const knex = Knex(knexConfig);

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
