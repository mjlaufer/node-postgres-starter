import { HttpError } from '../../helpers/errors';
import { generateId } from '../../helpers/id';
import { PostCreateRequest, PostUpdateRequest, PostEntity } from '../../types';
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

export async function fetchPost(id: string): Promise<Post> {
    try {
        const postEntity: PostEntity = await db.posts.findById(id);
        return new Post(postEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function createPost(postRequestData: PostCreateRequest): Promise<Post> {
    try {
        const postEntity: PostEntity = await db.posts.create({
            id: generateId(),
            ...postRequestData,
        });

        return new Post(postEntity);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function updatePost(postData: PostUpdateRequest): Promise<Post> {
    try {
        const postEntity: PostEntity = await db.posts.findById(postData.id);
        const updatedPostEntity: PostEntity = { ...postEntity, ...postData };

        await db.posts.update(updatedPostEntity);

        return new Post(updatedPostEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function deletePost(id: string): Promise<void> {
    try {
        await db.posts.destroy(id);
    } catch (err) {
        throw new HttpError(err);
    }
}
