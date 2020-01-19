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
});
