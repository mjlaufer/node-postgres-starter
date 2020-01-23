declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        PG_HOST: string;
        PG_PORT: string;
        POSTGRES_DB: string;
        POSTGRES_DB_TEST: string;
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_URL: string;
        SESSION_SECRET: string;
    }
}
