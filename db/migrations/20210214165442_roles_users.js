exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE roles (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL
        );

        ALTER TABLE users
            ADD COLUMN role_id INTEGER REFERENCES roles (id);
    `);
};

exports.down = function (knex) {
    return knex.raw(`
        ALTER TABLE users
            DROP COLUMN role_id;

        DROP TABLE IF EXISTS roles
    `);
};
