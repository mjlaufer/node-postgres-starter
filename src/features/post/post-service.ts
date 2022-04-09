import { toString } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import db from '@db';
import { makePost } from '@features/post/post-helpers';
import { HttpError, InternalServerError, ForbiddenError, NotFoundError } from '@errors';
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

function handleError(err: unknown): never {
    if (err instanceof HttpError) {
        throw err;
    }
    const message = err instanceof Error ? err.message : toString(err);
    throw new InternalServerError(message);
}

export async function fetchPosts(paginationOptions: PaginationOptions): Promise<Post[]> {
    try {
        const postEntities = await db.posts.findAll(paginationOptions);
        return postEntities.map(makePost);
    } catch (err) {
        throw handleError(err);
    }
}

export async function fetchPost(id: string): Promise<Post> {
    try {
        const postEntity = await db.posts.findById(id);
        if (!postEntity) {
            throw new NotFoundError(`Could not find post with ID ${id}`);
        }
        return makePost(postEntity);
    } catch (err) {
        throw handleError(err);
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
        throw handleError(err);
    }
}

export async function updatePost({ requestor, data }: PostUpdateParams): Promise<Post> {
    try {
        const postEntity = await db.posts.findById(data.id);
        if (!postEntity) {
            throw new NotFoundError(`Could not find post with ID ${data.id}`);
        }
        if (requestor.role !== 'admin' && requestor.id !== postEntity.authorId) {
            throw new ForbiddenError('User ID does not match resource');
        }

        const updatedPostEntity = { ...postEntity, ...data };
        await db.posts.update(updatedPostEntity);
        return makePost(updatedPostEntity);
    } catch (err) {
        throw handleError(err);
    }
}

export async function deletePost({
    requestor,
    data: { id: postId },
}: PostDeleteParams): Promise<void> {
    try {
        if (requestor.role !== 'admin') {
            const postEntity = await db.posts.findById(postId);
            if (!postEntity) {
                throw new NotFoundError(`Could not find post with ID ${postId}`);
            }
            if (requestor.id !== postEntity.authorId) {
                throw new ForbiddenError('User ID does not match resource');
            }
        }
        await db.posts.destroy(postId);
    } catch (err) {
        handleError(err);
    }
}
