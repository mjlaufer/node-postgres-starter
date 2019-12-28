exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            body TEXT,
            user_id INTEGER NOT NULL REFERENCES users (id),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            deleted_at TIMESTAMPTZ DEFAULT NULL
        )
    `);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE IF EXISTS posts`);
};
