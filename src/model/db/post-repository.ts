import { IDatabase } from 'pg-promise';
import { PostEntity } from '../../types';
import { posts as sql } from './sql';

export default class PostRepository {
    constructor(private db: IDatabase<any>) {}

    async findAll(): Promise<PostEntity[]> {
        const posts = await this.db.any<PostEntity>(sql.findAll);
        return posts;
    }
}
