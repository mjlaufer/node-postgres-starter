exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
};

exports.down = function (knex) {
    return knex.raw(`DROP TABLE IF EXISTS users`);
};
