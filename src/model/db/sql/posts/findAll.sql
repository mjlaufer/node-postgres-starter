SELECT p.id, p.body, p.title, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id
