import pgPromise from 'pg-promise';
import connection from './connection';

export const pgp = pgPromise();
export const db = pgp(connection);
