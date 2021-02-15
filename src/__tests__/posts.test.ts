import { has, head, identity, isObject } from 'lodash';
import { startServer, Server } from '@server';
import * as generate from '@test/utils/generate';
import { request, getUserCookie, closeOpenHandles, resetDb } from '@test/utils/integration';

import { Post, User } from '@types';

jest.mock('uuid', () => ({
    v4: () => 'test_uuid',
}));

describe('/posts', () => {
    let server: Server;
    let port = '0';
    let postsUrl: string;
    let usersUrl: string;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        port = isObject(address) && has(address, 'port') ? String(address.port) : port;
        postsUrl = `http://localhost:${port}/posts/`;
        usersUrl = `http://localhost:${port}/users/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('GET /posts', async () => {
        const response: { posts: Post[] } = await request(postsUrl).json();

        for (const post of response.posts) {
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
            expect(post).toHaveProperty('author');
        }
    });

    test('GET /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await request(postsUrl).json();
        const firstPost = head(posts) as Post;

        const response: Post = await request(`${postsUrl}${firstPost.id}`).json();

        expect(response).toMatchObject(firstPost);
    });

    test('POST /posts', async () => {
        const { users }: { users: User[] } = await request(usersUrl).json();
        const firstUser = head(users) as User;

        const testPostCreateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
            userId: firstUser.id,
        };

        const response: Post = await request
            .post(postsUrl, {
                headers: {
                    cookie: await getUserCookie(port),
                },
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
        const { posts }: { posts: Post[] } = await request(postsUrl).json();
        const firstPost = head(posts) as Post;

        const testPostUpdateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };

        const response: Post = await request
            .put(`${postsUrl}${firstPost.id}`, {
                headers: {
                    cookie: await getUserCookie(port),
                },
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
        const { posts }: { posts: Post[] } = await request(postsUrl).json();
        const firstPost = head(posts) as Post;

        const response = await request
            .delete(`${postsUrl}${firstPost.id}`, {
                headers: {
                    cookie: await getUserCookie(port),
                },
            })
            .json();

        expect(response).toBe('');

        const err = (await request(`${postsUrl}${firstPost.id}`).json().catch(identity)) as Error;

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
