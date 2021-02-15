const rolesData = require('../data/roles.json');
const usersData = require('../data/users.json');
const postsData = require('../data/posts.json');

exports.seed = function (knex) {
    return (async function () {
        await knex('posts').del();
        await knex('users').del();
        await knex('roles').del();

        await knex('roles').insert(rolesData);

        // Each user in `usersData` has a role name assigned to its `role` property.
        // Change the role name to a role id before inserting into the db.
        const userInserts = usersData.map((user) => {
            const { role: roleName, ...rest } = user;
            let roleId = 2; // Default to `user` role.
            const role = rolesData.find((role) => role.name === roleName);
            if (role) {
                roleId = role.id;
            }

            return {
                ...rest,
                role_id: roleId,
            };
        });

        await knex('users').insert(userInserts);

        // Each post in `postsData` has a username assigned to its `author` property.
        // Change the username to a user id before inserting into the db.
        const postInserts = [];
        for (const post of postsData) {
            postInserts.push(insertPostRecord(knex, post));
        }

        await Promise.all(postInserts);
    })();
};

async function insertPostRecord(knex, post) {
    const username = post.author;
    const user = await knex('users').where({ username }).first();

    await knex('posts').insert({
        id: post.id,
        title: post.title,
        body: post.body,
        user_id: user.id,
    });
}
