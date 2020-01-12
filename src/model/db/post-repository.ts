import { IDatabase } from 'pg-promise';
import { PostEntity } from '../../types';

export default class PostRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(): Promise<PostEntity[]> {
        const posts = await this.db.any<PostEntity>(
            'SELECT p.id, p.body, p.title, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id',
        );
        return posts;
    }
}
