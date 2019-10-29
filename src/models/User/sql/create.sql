/*
    Inserts a new User record.
*/
INSERT INTO users(email, username)
VALUES(${email}, ${username})
RETURNING *
