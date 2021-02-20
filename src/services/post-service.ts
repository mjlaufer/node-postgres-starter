import { v4 as uuidv4 } from 'uuid';
import db from '@db';
import { makePost } from '@helpers/post';
import { HttpError } from '@utils/errors';
import { User, Post, PostCreateRequest, PostEntity, PaginationOptions } from '@types';

interface PostUpdateParams {
    requestor: User;
    data: Partial<PostEntity> & { id: string };
}

interface PostDeleteParams {
    requestor: User;
    data: {
        id: string;
    };
}

export async function fetchPosts(paginationOptions: PaginationOptions): Promise<Post[]> {
    try {
        const postEntities = await db.posts.findAll(paginationOptions);
        return postEntities.map(makePost);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function fetchPost(id: string): Promise<Post> {
    try {
        const postEntity = await db.posts.findById(id);
        return makePost(postEntity);
    } catch (err) {
        throw new HttpError(err, 404);
    }
}

export async function createPost(postRequestData: PostCreateRequest): Promise<Post> {
    try {
        const postEntity = await db.posts.create({
            id: uuidv4(),
            ...postRequestData,
        });
        return makePost(postEntity);
    } catch (err) {
        throw new HttpError(err);
    }
}

export async function updatePost({ requestor, data }: PostUpdateParams): Promise<Post> {
    try {
        const postEntity = await db.posts.findById(data.id);

        if (requestor.role !== 'admin' && requestor.id !== postEntity.authorId) {
            throw new HttpError('User ID does not match resource', 403);
        }

        const updatedPostEntity = { ...postEntity, ...data };
        await db.posts.update(updatedPostEntity);

        return makePost(updatedPostEntity);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(err, 404);
    }
}

export async function deletePost({
    requestor,
    data: { id: postId },
}: PostDeleteParams): Promise<void> {
    try {
        if (requestor.role !== 'admin') {
            const postEntity = await db.posts.findById(postId);

            if (requestor.id !== postEntity.authorId) {
                throw new HttpError('User ID does not match resource', 403);
            }
        }

        await db.posts.destroy(postId);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        throw new HttpError(err);
    }
}
