exports.up = function (knex) {
    return knex.raw(`
        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON posts
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = function (knex) {
    return knex.raw(`DROP TRIGGER IF EXISTS set_timestamp ON posts`);
};
