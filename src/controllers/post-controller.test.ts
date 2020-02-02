import { Request, Response } from 'express';
import Post from '../model/Post';
import * as postService from '../model/services/post-service';
import * as postController from './post-controller';

const mockUuid = '00000000-0000-0000-0000-000000000000';

describe('postController', () => {
    const mockPost: Post = {
        id: mockUuid,
        title: 'title',
        body: 'body',
        author: 'author',
    };
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        res.json = jest.fn();
        res.status = jest.fn(() => res);
        res.end = jest.fn();
    });

    describe('#fetchPosts', () => {
        test('retrieves a list of posts', async () => {
            const fetchPosts = jest.spyOn(postService, 'fetchPosts').mockResolvedValue([mockPost]);

            expect.assertions(2);

            await postController.fetchPosts(req, res);

            expect(fetchPosts).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ posts: [mockPost] });
        });
    });

    describe('#fetchPost', () => {
        test('retrieves the correct post', async () => {
            const fetchPost = jest.spyOn(postService, 'fetchPost').mockResolvedValue(mockPost);
            req.params = { id: mockUuid };

            expect.assertions(2);

            await postController.fetchPost(req, res);

            expect(fetchPost).toHaveBeenCalledWith(mockPost.id);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('#createPost', () => {
        const data = {
            title: 'title',
            body: 'body',
        };

        test('creates a new post', async () => {
            const createPost = jest.spyOn(postService, 'createPost').mockResolvedValue(mockPost);
            req.body = data;

            expect.assertions(2);

            await postController.createPost(req, res);

            expect(createPost).toHaveBeenCalledWith(data);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('#updatePost', () => {
        const data = {
            title: 'updated_title',
            body: 'updated_body',
        };

        test('updates a post', async () => {
            const updatePost = jest
                .spyOn(postService, 'updatePost')
                .mockResolvedValue({ ...mockPost, ...data });
            req.params = { id: mockUuid };
            req.body = data;

            expect.assertions(2);

            await postController.updatePost(req, res);

            expect(updatePost).toHaveBeenCalledWith({
                id: mockUuid,
                ...data,
            });
            expect(res.json).toHaveBeenCalledWith({ ...mockPost, ...data });
        });
    });

    describe('#deletePost', () => {
        test('deletes a post', async () => {
            const deletePost = jest.spyOn(postService, 'deletePost').mockResolvedValue();
            req.params = { id: mockUuid };

            expect.assertions(2);

            await postController.deletePost(req, res);

            expect(deletePost).toHaveBeenCalledWith(mockPost.id);
            expect(res.end).toHaveBeenCalled();
        });
    });
});
