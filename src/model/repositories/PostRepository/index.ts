import { snakeCaseKeys } from '../../../helpers/object';
import { PostData } from '../../../types';
import { db } from '../../db';
import sql from './sql';

export interface PostEntity {
    id: number;
    title: string;
    body: string;
    user_id: number;
}

export default class PostRepository {
    static async create(postData: PostData): Promise<PostEntity> {
        const post: PostEntity = await db.one(sql.create, snakeCaseKeys(postData));
        return post;
    }
}
