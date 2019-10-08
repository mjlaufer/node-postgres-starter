import dotenv from 'dotenv';
import { pickBy, toNumber } from 'lodash';

dotenv.config();

interface ConnectionConfig {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
}

const {
    NODE_ENV,
    DATABASE_URL,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_NAME_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

const connectionConfig: ConnectionConfig = pickBy({
    host: DB_HOST,
    port: toNumber(DB_PORT),
    database: NODE_ENV === 'test' ? DB_NAME_TEST : DB_NAME,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});

const connectionString = DATABASE_URL || '';

const connection = NODE_ENV === 'production' ? connectionString : connectionConfig;

export default connection;
