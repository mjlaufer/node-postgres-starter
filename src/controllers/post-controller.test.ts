import * as postService from '@services/post-service';
import * as generate from '@test/utils/generate';
import * as postController from './post-controller';

describe('postController', () => {
    const mockPost = generate.post();

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('fetchPosts', async () => {
        const fetchPosts = jest.spyOn(postService, 'fetchPosts').mockResolvedValue([mockPost]);

        expect.assertions(4);

        const req = generate.req();
        const res = generate.res();
        await postController.fetchPosts(req, res);

        expect(fetchPosts).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 10, order: 'DESC' }),
        );
        expect(fetchPosts).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ posts: [mockPost] });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('fetchPost', async () => {
        const fetchPost = jest.spyOn(postService, 'fetchPost').mockResolvedValue(mockPost);

        expect.assertions(4);

        const req = generate.req({ params: { id: mockPost.id } });
        const res = generate.res();
        await postController.fetchPost(req, res);

        expect(fetchPost).toHaveBeenCalledWith(mockPost.id);
        expect(fetchPost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockPost);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('createPost', async () => {
        const createPost = jest.spyOn(postService, 'createPost').mockResolvedValue(mockPost);

        expect.assertions(4);

        const data = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };
        const req = generate.req({ body: data });
        const res = generate.res();
        await postController.createPost(req, res);

        expect(createPost).toHaveBeenCalledWith(data);
        expect(createPost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockPost);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('updatePost', async () => {
        const data = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };
        const updatePost = jest
            .spyOn(postService, 'updatePost')
            .mockResolvedValue({ ...mockPost, ...data });

        expect.assertions(4);

        const req = generate.req({ params: { id: mockPost.id }, body: data });
        const res = generate.res();
        await postController.updatePost(req, res);

        expect(updatePost).toHaveBeenCalledWith({
            id: mockPost.id,
            ...data,
        });
        expect(updatePost).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ ...mockPost, ...data });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('deletePost', async () => {
        const deletePost = jest.spyOn(postService, 'deletePost').mockResolvedValue();

        expect.assertions(3);

        const req = generate.req({ params: { id: mockPost.id } });
        const res = generate.res();
        await postController.deletePost(req, res);

        expect(deletePost).toHaveBeenCalledWith(mockPost.id);
        expect(deletePost).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledTimes(1);
    });
});
