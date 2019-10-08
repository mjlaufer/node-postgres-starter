/*
    Inserts a new User record.
*/
INSERT INTO users(email)
VALUES(${email})
RETURNING *
