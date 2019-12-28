declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_NAME: string;
        DB_NAME_TEST: string;
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_URL: string;
        SESSION_SECRET: string;
    }
}
