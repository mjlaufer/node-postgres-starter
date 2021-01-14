import { head, identity, isString } from 'lodash';
import { startServer, Server } from '@server';
import { apiClient, closeOpenHandles, generate, resetDb } from '@test/utils';
import { Post, User } from '@types';

jest.mock('uuid', () => ({
    v4: () => 'test_uuid',
}));

describe('/posts', () => {
    let postsUrl: string;
    let usersUrl: string;
    let server: Server;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        const port = isString(address) ? '0' : address?.port;
        postsUrl = `http://localhost:${port}/posts/`;
        usersUrl = `http://localhost:${port}/users/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('GET /posts', async () => {
        const response: { posts: Post[] } = await apiClient(postsUrl).json();

        for (const post of response.posts) {
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
            expect(post).toHaveProperty('author');
        }
    });

    test('GET /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await apiClient(postsUrl).json();
        const firstPost = head(posts) as Post;

        const response: Post = await apiClient(`${postsUrl}${firstPost.id}`).json();

        expect(response).toMatchObject(firstPost);
    });

    test('POST /posts', async () => {
        const { users }: { users: User[] } = await apiClient(usersUrl).json();
        const firstUser = head(users) as User;

        const testPostCreateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
            userId: firstUser.id,
        };

        const response: Post = await apiClient
            .post(postsUrl, {
                json: testPostCreateData,
            })
            .json();

        expect(response).toMatchObject({
            id: 'test_uuid',
            title: testPostCreateData.title,
            body: testPostCreateData.body,
            author: firstUser.username,
        });
    });

    test('PUT /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await apiClient(postsUrl).json();
        const firstPost = head(posts) as Post;

        const testPostUpdateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };

        const response: Post = await apiClient
            .put(`${postsUrl}${firstPost.id}`, {
                json: testPostUpdateData,
            })
            .json();

        expect(response).toMatchObject({
            id: firstPost.id,
            title: testPostUpdateData.title,
            body: testPostUpdateData.body,
            author: firstPost.author,
        });
    });

    test('DELETE /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await apiClient(postsUrl).json();
        const firstPost = head(posts) as Post;

        const response = await apiClient.delete(`${postsUrl}${firstPost.id}`).json();

        expect(response).toBe('');

        const err = (await apiClient(`${postsUrl}${firstPost.id}`).json().catch(identity)) as Error;

        // Because `firstPost.id` is dynamic, we need to replace it with a constant, so our snapshot remains consistent.
        const testErr = err.message.replace(firstPost.id, 'GENERATED_POST_ID');
        expect(testErr).toMatchInlineSnapshot(`
            "(404) QueryResultError {
                code: queryResultErrorCode.noData
                message: \\"No data returned from the query.\\"
                received: 0
                query: \\"SELECT p.id, p.body, p.title, p.created_at, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE p.id = 'GENERATED_POST_ID'\\"
            }"
        `);
    });
});
