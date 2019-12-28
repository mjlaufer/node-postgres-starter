UPDATE users
SET email = ${email},
username = ${username}
WHERE id = ${id}
RETURNING *
