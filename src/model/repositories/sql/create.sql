INSERT INTO ${table:name}(email, username, password)
VALUES(${email}, ${username}, ${password})
RETURNING *
