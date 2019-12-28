import pgPromise from 'pg-promise';
import { HttpError } from '../../errors';
import { PostEntity } from '../../types';
import { db } from '../db';
import Post from '../Post';
import * as postService from './post-service';

jest.mock('../db', () => ({
    db: {
        posts: {},
    },
    pgp: pgPromise(),
}));

describe('postService', () => {
    const mockPostEntity: PostEntity = {
        id: 1,
        title: 'title',
        body: 'body',
        username: 'username',
        created_at: '',
        modified_at: '',
        deleted_at: null,
    };

    const mockPost = new Post(mockPostEntity);

    describe('#fetchPosts', () => {
        test('returns a list of all posts', async () => {
            db.posts.findAll = jest.fn().mockResolvedValue([mockPostEntity]);

            expect.assertions(2);

            const posts = await postService.fetchPosts();

            expect(db.posts.findAll).toHaveBeenCalled();
            expect(posts).toEqual([mockPost]);
        });

        test('throws an HttpError if unsuccessful', async () => {
            db.posts.findAll = jest.fn().mockRejectedValue('mock error message');

            expect.assertions(1);

            await expect(postService.fetchPosts()).rejects.toThrow(
                new HttpError('mock error message'),
            );
        });
    });
});
