import { HttpError } from '../../helpers/errors';
import { PostEntity } from '../../types';
import { db } from '../db';
import Post from '../Post';

export async function fetchPosts(): Promise<Post[]> {
    try {
        const postEntities: PostEntity[] = await db.posts.findAll();
        return postEntities.map(postEntity => new Post(postEntity));
    } catch (err) {
        throw new HttpError(err);
    }
}
