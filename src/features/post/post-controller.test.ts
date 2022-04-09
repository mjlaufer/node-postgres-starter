import * as postService from '@features/post/post-service';
import * as generate from '@test/utils/generate';
import * as postController from './post-controller';

describe('postController', () => {
    const mockUser = generate.user();
    const mockPost = generate.post({
        author: {
            id: mockUser.id,
            username: mockUser.username,
        },
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('fetchPosts', async () => {
        const fetchPosts = jest.spyOn(postService, 'fetchPosts').mockResolvedValue([mockPost]);
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await postController.fetchPosts(req, res, next);

        expect(fetchPosts).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 10, order: 'DESC' }),
        );
        expect(fetchPosts).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ posts: [mockPost] });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('fetchPost', async () => {
        const fetchPost = jest.spyOn(postService, 'fetchPost').mockResolvedValue(mockPost);
        const req = generate.req({ params: { id: mockPost.id } });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await postController.fetchPost(req, res, next);

        expect(fetchPost).toHaveBeenCalledWith(mockPost.id);
        expect(fetchPost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockPost);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('createPost', async () => {
        const createPost = jest.spyOn(postService, 'createPost').mockResolvedValue(mockPost);
        const data = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };
        const req = generate.req({ body: data });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await postController.createPost(req, res, next);

        expect(createPost).toHaveBeenCalledWith(data);
        expect(createPost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockPost);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('updatePost', async () => {
        const postUpdateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };
        const updatePost = jest
            .spyOn(postService, 'updatePost')
            .mockResolvedValue({ ...mockPost, ...postUpdateData });
        const req = generate.req({
            user: mockUser,
            params: { id: mockPost.id },
            body: postUpdateData,
        });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await postController.updatePost(req, res, next);

        expect(updatePost).toHaveBeenCalledWith({
            requestor: mockUser,
            data: {
                id: mockPost.id,
                ...postUpdateData,
            },
        });
        expect(updatePost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ ...mockPost, ...postUpdateData });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('deletePost', async () => {
        const deletePost = jest.spyOn(postService, 'deletePost').mockResolvedValue();
        const req = generate.req({ user: mockUser, params: { id: mockPost.id } });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(3);
        await postController.deletePost(req, res, next);

        expect(deletePost).toHaveBeenCalledWith({
            requestor: mockUser,
            data: {
                id: mockPost.id,
            },
        });
        expect(deletePost).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledTimes(1);
    });
});
