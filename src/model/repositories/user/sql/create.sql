/*
    Inserts a new User record.
*/
INSERT INTO users(email, username, password)
VALUES(${email}, ${username}, ${password})
RETURNING *
