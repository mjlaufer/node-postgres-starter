import { IDatabase } from 'pg-promise';
import { PostCreateRequest, PostEntity } from '../../types';

interface PostCreateRequestWithId extends PostCreateRequest {
    id: string;
}

export default class PostRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(): Promise<PostEntity[]> {
        const posts = await this.db.any<PostEntity>(
            'SELECT p.id, p.body, p.title, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id',
        );
        return posts;
    }

    async findById(id: string): Promise<PostEntity> {
        const post = await this.db.one<PostEntity>('SELECT * FROM posts WHERE id = $1', id);
        return post;
    }

    async create(postRequestData: PostCreateRequestWithId): Promise<PostEntity> {
        const newPost = await this.db.one<PostEntity>(
            'INSERT INTO posts(id, title, body) VALUES(${id}, ${title}, ${body} RETURNING *',
            postRequestData,
        );
        return newPost;
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
