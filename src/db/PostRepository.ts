import { IDatabase } from 'pg-promise';
import { PostCreateRequest, PostEntity, PaginationOptions } from '@types';

interface PostCreateRequestWithId extends PostCreateRequest {
    id: string;
}

export default class PostRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(paginationOptions: PaginationOptions): Promise<PostEntity[]> {
        const posts = await this.db.any<PostEntity>(
            'SELECT p.id, p.body, p.title, p.created_at, u.username FROM posts p ' +
                'INNER JOIN users u ON u.id = p.user_id ' +
                'WHERE p.created_at < ${lastCreatedAt} ORDER BY p.created_at ${order:raw} LIMIT ${limit}',
            paginationOptions,
        );
        return posts;
    }

    async findById(id: string): Promise<PostEntity> {
        const post = await this.db.one<PostEntity>(
            'SELECT p.id, p.body, p.title, p.created_at, u.username FROM posts p ' +
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
        return result;
    }

    async update(PostEntity: PostEntity): Promise<PostEntity> {
        const updatedPost = await this.db.one<PostEntity>(
            'UPDATE posts SET title = ${title}, body = ${body} WHERE id = ${id} RETURNING *',
            PostEntity,
        );
        return updatedPost;
    }

    async destroy(id: string): Promise<void> {
        await this.db.none('DELETE FROM posts WHERE id = $1', id);
    }
}
