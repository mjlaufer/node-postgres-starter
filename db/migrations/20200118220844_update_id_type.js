exports.up = function (knex) {
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

exports.down = function (knex) {
    return knex.raw(`
        CREATE SEQUENCE posts_serial AS INTEGER START 1 OWNED BY posts.id;

        ALTER TABLE posts
            ALTER COLUMN id SET DEFAULT nextval('posts_serial');

        ALTER TABLE posts
            DROP CONSTRAINT posts_user_id_fkey;

        CREATE SEQUENCE users_serial AS INTEGER START 1 OWNED BY users.id;

        ALTER TABLE users
            ALTER COLUMN id SET DEFAULT nextval('users_serial');

        ALTER TABLE posts
            ADD CONSTRAINT posts_user_id_fkey
            FOREIGN KEY (user_id)
            REFERENCES users (id);
    `);
};
