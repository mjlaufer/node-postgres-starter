import pgPromise from 'pg-promise';
import { HttpError } from '../../helpers/errors';
import { PostCreateRequest, PostUpdateRequest, PostEntity, PaginationOptions } from '../../types';
import { db } from '../db';
import Post from '../Post';
import * as postService from './post-service';

const mockUuid = '00000000-0000-0000-0000-000000000000';

const paginationOptions: PaginationOptions = {
    lastCreatedAt: new Date(),
    limit: 10,
    order: 'DESC',
};

jest.mock('../db', () => ({
    db: {
        posts: {},
    },
    pgp: pgPromise(),
}));

describe('postService', () => {
    const mockPostRequest: PostCreateRequest = {
        title: 'title',
        body: 'body',
        userId: '00000000-0000-0000-0000-000000000001',
    };

    const mockPostEntity: PostEntity = {
        id: mockUuid,
        title: 'title',
        body: 'body',
        username: 'username',
        createdAt: new Date(),
        modifiedAt: new Date(),
        deletedAt: null,
    };

    const mockPost = new Post(mockPostEntity);

    describe('#fetchPosts', () => {
        test('returns a list of all posts', async () => {
            db.posts.findAll = jest.fn().mockResolvedValue([mockPostEntity]);

            expect.assertions(2);

            const posts = await postService.fetchPosts(paginationOptions);

            expect(db.posts.findAll).toHaveBeenCalled();
            expect(posts).toEqual([mockPost]);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.findAll = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.fetchPosts(paginationOptions)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#fetchPost', () => {
        test('returns the correct post', async () => {
            db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);

            expect.assertions(2);

            const post = await postService.fetchPost(mockPostEntity.id);

            expect(db.posts.findById).toHaveBeenCalled();
            expect(post).toEqual(mockPost);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.findById = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.fetchPost(mockPostEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#createPost', () => {
        test('inserts and returns a new post', async () => {
            db.posts.create = jest.fn().mockResolvedValue(mockPostEntity);

            expect.assertions(2);

            const newPost = await postService.createPost(mockPostRequest);

            expect(db.posts.create).toHaveBeenCalled();
            expect(newPost).toEqual(mockPost);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.create = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.createPost(mockPostRequest)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#updatePost', () => {
        const updatedPostData: PostUpdateRequest = {
            id: mockUuid,
            title: 'updated_title',
            body: 'updated_body',
        };

        const updatedPostEntity: PostEntity = {
            ...mockPostEntity,
            ...updatedPostData,
        };

        test('updates and returns a post', async () => {
            db.posts.findById = jest.fn().mockResolvedValue(mockPostEntity);
            db.posts.update = jest.fn().mockResolvedValue(updatedPostEntity);

            expect.assertions(3);

            const post = await postService.updatePost(updatedPostData);

            expect(db.posts.findById).toHaveBeenCalled();
            expect(db.posts.update).toHaveBeenCalled();
            expect(post).toEqual(new Post(updatedPostEntity));
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.update = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.updatePost(mockPostEntity)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });

    describe('#deletePost', () => {
        test('deletes the correct post', async () => {
            db.posts.destroy = jest.fn();

            expect.assertions(1);

            await postService.deletePost(mockPostEntity.id);

            expect(db.posts.destroy).toHaveBeenCalled();
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.destroy = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.deletePost(mockPostEntity.id)).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
