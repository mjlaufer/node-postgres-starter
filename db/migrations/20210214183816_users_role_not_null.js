exports.up = function (knex) {
    return knex.raw(`
        ALTER TABLE users
            ALTER COLUMN role_id SET NOT NULL;
    `);
};

exports.down = function (knex) {
    return knex.raw(`
        ALTER TABLE users
            ALTER COLUMN role_id DROP NOT NULL;
    `);
};
