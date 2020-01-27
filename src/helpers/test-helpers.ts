import Knex from 'knex';
import * as knexConfig from '../../knexfile';
import { db } from '../model/db';
import { redisClient } from '../middleware/session';

export const knex = Knex(knexConfig);

export async function closeOpenHandles(): Promise<void> {
    db.$pool.end();
    await knex.destroy();
    await new Promise(resolve => redisClient.quit(resolve));
    await new Promise(resolve => setImmediate(resolve));
}
