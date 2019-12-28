INSERT INTO posts(title, body, user_id)
VALUES(${title}, ${body}, ${userId})
RETURNING *
