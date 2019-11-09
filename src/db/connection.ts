import dotenv from 'dotenv';

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
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_NAME_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

const connectionConfig: ConnectionConfig = {
    host: DB_HOST,
    port: DB_PORT,
    database: NODE_ENV === 'test' ? DB_NAME_TEST : DB_NAME,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
};

const connection = NODE_ENV === 'production' ? DATABASE_URL : connectionConfig;

export default connection;
