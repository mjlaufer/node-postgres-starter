exports.up = function (knex) {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
};

exports.down = function (knex) {
    return knex.raw(`DROP FUNCTION IF EXISTS trigger_set_timestamp()`);
};
