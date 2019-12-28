require('dotenv').config();
const path = require('path');

const { DB_HOST, DB_NAME, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

module.exports = {
    client: 'pg',
    connection: {
        host: DB_HOST,
        database: DB_NAME,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds'),
    },
};
