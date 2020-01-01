UPDATE ${table:name}
SET email = ${email},
username = ${username}
WHERE id = ${id}
RETURNING *
