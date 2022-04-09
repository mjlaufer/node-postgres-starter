import dotenv from 'dotenv';
import pgp, { ExtendedProtocol } from './pgp';

dotenv.config();

interface ConnectionConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

const {
    NODE_ENV,
    DATABASE_URL,
    PG_HOST,
    PG_PORT,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

const connectionConfig: ConnectionConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: NODE_ENV === 'test' ? POSTGRES_DB_TEST : POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
};

const connection = NODE_ENV === 'production' ? DATABASE_URL : connectionConfig;

export default pgp(connection) as ExtendedProtocol;
