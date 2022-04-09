import { IDatabase } from 'pg-promise';
import { PostCreateRequest, PostEntity, PaginationOptions } from '@types';

interface PostCreateRequestWithId extends PostCreateRequest {
    id: string;
}

export default class PostRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(paginationOptions: PaginationOptions): Promise<PostEntity[]> {
        const posts = await this.db.any<PostEntity>(
            'SELECT p.id, p.body, p.title, p.created_at, u.id as author_id, u.username as author_username FROM posts p ' +
                'INNER JOIN users u ON u.id = p.user_id ' +
                'WHERE p.created_at < ${lastCreatedAt} ORDER BY p.created_at ${order:raw} LIMIT ${limit}',
            paginationOptions,
        );
        return posts;
    }

    async findById(id: string): Promise<PostEntity | null> {
        const post = await this.db.oneOrNone<PostEntity>(
            'SELECT p.id, p.body, p.title, p.created_at, u.id as author_id, u.username as author_username FROM posts p ' +
                'INNER JOIN users u ON u.id = p.user_id ' +
                'WHERE p.id = $1',
            id,
        );
        return post;
    }

    async create(postRequestData: PostCreateRequestWithId): Promise<PostEntity> {
        const { id } = await this.db.one<{ id: string }>(
            'INSERT INTO posts (id, title, body, user_id) ' +
                'VALUES (${id}, ${title}, ${body}, ${userId}) ' +
                'RETURNING id',
            postRequestData,
        );
        const result = await this.findById(id);
        return result!;
    }

    async update(PostEntity: PostEntity): Promise<PostEntity> {
        const result = await this.db.one<PostEntity>(
            'UPDATE posts SET title = ${title}, body = ${body} FROM ' +
                '(SELECT id, title, body, user_id, created_at, updated_at FROM posts WHERE id = ${id} FOR UPDATE) p ' +
                'INNER JOIN users u ON u.id = p.user_id ' +
                'WHERE posts.id = p.id ' +
                'RETURNING posts.id, posts.title, posts.body, posts.created_at, posts.updated_at, u.id as author_id, u.username as author_username',
            PostEntity,
        );
        return result;
    }

    async destroy(id: string): Promise<void> {
        await this.db.none('DELETE FROM posts WHERE id = $1', id);
    }
}
