import { identity, pick } from 'lodash';
import pgPromise from 'pg-promise';
import db from '@db';
import { makePost } from '@features/post/post-helpers';
import * as generate from '@test/utils/generate';
import { InternalServerError } from '@errors';
import { PostCreateRequest, PostEntity, PaginationOptions } from '@types';
import * as postService from './post-service';

jest.mock('@db', () => ({
    posts: {},
    pgp: pgPromise(),
}));

describe('postService', () => {
    const mockUser = generate.user();

    const paginationOptions: PaginationOptions = {
        lastCreatedAt: new Date(),
        limit: 10,
        order: 'DESC',
    };

    const mockPostRequest: PostCreateRequest = {
        title: generate.postTitle(),
        body: generate.postBody(),
        userId: mockUser.id,
    };

    const mockPostEntity: PostEntity = {
        id: generate.id(),
        title: mockPostRequest.title,
        body: mockPostRequest.body,
        authorId: mockUser.id,
        authorUsername: mockUser.username,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockPost = makePost(mockPostEntity);

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('fetchPosts', async () => {
        db.posts.findAll = jest.fn().mockResolvedValue([mockPostEntity]);

        expect.assertions(3);

        const posts = await postService.fetchPosts(paginationOptions);

        expect(db.posts.findAll).toHaveBeenCalledWith(paginationOptions);
        expect(db.posts.findAll).toHaveBeenCalledTimes(1);
        expect(posts).toEqual([mockPost]);
    });

    test('fetchPosts: fail', async () => {
        db.posts.findAll = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await postService.fetchPosts(paginationOptions).catch(identity);
        expect(err).toEqual(new InternalServerError('mock error message'));
        expect(db.posts.findAll).toHaveBeenCalledTimes(1);
    });

    test('fetchPost', async () => {
        db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);

        expect.assertions(3);

        const post = await postService.fetchPost(mockPostEntity.id);

        expect(db.posts.findById).toHaveBeenCalledWith(mockPostEntity.id);
        expect(db.posts.findById).toHaveBeenCalledTimes(1);
        expect(post).toEqual(mockPost);
    });

    test('fetchPost: fail', async () => {
        db.posts.findById = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await postService.fetchPost(mockPostEntity.id).catch(identity);
        expect(err).toEqual(new InternalServerError('mock error message'));
        expect(db.posts.findById).toHaveBeenCalledTimes(1);
    });

    test('createPost', async () => {
        db.posts.create = jest.fn().mockResolvedValue(mockPostEntity);

        expect.assertions(3);

        const newPost = await postService.createPost(mockPostRequest);

        expect(db.posts.create).toHaveBeenCalledWith(
            expect.objectContaining(pick(mockPostRequest, ['title', 'body'])), // This object will also contain an id.
        );
        expect(db.posts.create).toHaveBeenCalledTimes(1);
        expect(newPost).toEqual(mockPost);
    });

    test('createPost: fail', async () => {
        db.posts.create = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await postService.createPost(mockPostRequest).catch(identity);
        expect(err).toEqual(new InternalServerError('mock error message'));
        expect(db.posts.create).toHaveBeenCalledTimes(1);
    });

    test('updatePost', async () => {
        const updatedPostData = {
            id: mockPostEntity.id,
            title: 'updated_title',
            body: 'updated_body',
        };

        const updatedPostEntity = {
            ...mockPostEntity,
            ...updatedPostData,
        };

        db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);
        db.posts.update = jest.fn().mockResolvedValue(updatedPostEntity);

        expect.assertions(5);

        const post = await postService.updatePost({
            requestor: mockUser,
            data: updatedPostData,
        });

        expect(db.posts.findById).toHaveBeenCalledWith(mockPostEntity.id);
        expect(db.posts.findById).toHaveBeenCalledTimes(1);
        expect(db.posts.update).toHaveBeenCalledWith(
            expect.objectContaining(pick(updatedPostEntity, ['id', 'title', 'body', 'author'])),
        );
        expect(db.posts.update).toHaveBeenCalledTimes(1);
        expect(post).toEqual(makePost(updatedPostEntity));
    });

    test('updatePost: fail', async () => {
        db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);
        db.posts.update = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await postService
            .updatePost({
                requestor: mockUser,
                data: mockPostEntity,
            })
            .catch(identity);

        expect(err).toEqual(new InternalServerError('mock error message'));
        expect(db.posts.update).toHaveBeenCalledTimes(1);
    });

    test('deletePost', async () => {
        db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);
        db.posts.destroy = jest.fn();

        expect.assertions(2);

        await postService.deletePost({
            requestor: mockUser,
            data: { id: mockPostEntity.id },
        });

        expect(db.posts.destroy).toHaveBeenCalledWith(mockPostEntity.id);
        expect(db.posts.destroy).toHaveBeenCalledTimes(1);
    });

    test('deletePost: fail', async () => {
        db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);
        db.posts.destroy = jest.fn().mockRejectedValue('mock error message');

        expect.assertions(2);

        const err = await postService
            .deletePost({
                requestor: mockUser,
                data: { id: mockPostEntity.id },
            })
            .catch(identity);

        expect(err).toEqual(new InternalServerError('mock error message'));
        expect(db.posts.destroy).toHaveBeenCalledTimes(1);
    });
});
