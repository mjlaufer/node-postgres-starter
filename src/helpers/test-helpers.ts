import { db } from '../model/db';
import { redisClient } from '../middleware/session';

export async function closeOpenHandles(): Promise<void> {
    db.$pool.end();
    await new Promise(resolve => redisClient.quit(resolve));
    await new Promise(resolve => setImmediate(resolve));
}
