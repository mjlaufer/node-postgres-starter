exports.up = function(knex) {
    return knex.raw(`
        ALTER TABLE posts
            ALTER COLUMN id TYPE TEXT;

        ALTER TABLE posts
            DROP CONSTRAINT posts_user_id_fkey;

        ALTER TABLE posts
            ALTER COLUMN user_id TYPE TEXT;

        ALTER TABLE users
            ALTER COLUMN id TYPE TEXT;

        ALTER TABLE posts
            ADD CONSTRAINT posts_user_id_fkey
            FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE;
    `);
};

exports.down = function(knex) {
    return knex.raw(`
        ALTER TABLE posts
            ALTER COLUMN id TYPE SERIAL;

        ALTER TABLE posts
            DROP CONSTRAINT posts_user_id_fkey;

        ALTER TABLE posts
            ALTER COLUMN user_id TYPE INTEGER;

        ALTER TABLE users
            ALTER COLUMN id TYPE SERIAL;

        ALTER TABLE posts
            ADD CONSTRAINT posts_user_id_fkey
            FOREIGN KEY (user_id)
            REFERENCES users (id);
    `);
};
