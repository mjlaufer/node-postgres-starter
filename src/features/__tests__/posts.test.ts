import { has, head, identity, isObject } from 'lodash';
import { startServer, Server } from '@server';
import * as generate from '@test/utils/generate';
import { request, authenticate, closeOpenHandles, resetDb } from '@test/utils/integration';

import { Post } from '@types';

jest.mock('uuid', () => ({
    v4: () => 'test_uuid',
}));

describe('/posts', () => {
    let server: Server;
    let port = '0';
    let postsUrl: string;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        port = isObject(address) && has(address, 'port') ? String(address.port) : port;
        postsUrl = `http://localhost:${port}/posts/`;
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
        const [user, cookie] = await authenticate(port);

        const postCreateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
            userId: user.id,
        };

        const response: Post = await request
            .post(postsUrl, {
                headers: {
                    cookie,
                },
                json: postCreateData,
            })
            .json();

        expect(response).toMatchObject({
            id: 'test_uuid',
            title: postCreateData.title,
            body: postCreateData.body,
            author: {
                id: user.id,
                username: user.username,
            },
        });
    });

    test('PUT /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await request(postsUrl).json();
        const firstPost = head(posts) as Post;
        const [user, cookie] = await authenticate(port, { id: firstPost.author.id });

        const postUpdateData = {
            title: generate.postTitle(),
            body: generate.postBody(),
        };

        const response: Post = await request
            .put(`${postsUrl}${firstPost.id}`, {
                headers: {
                    cookie,
                },
                json: postUpdateData,
            })
            .json();

        expect(response).toMatchObject({
            id: firstPost.id,
            title: postUpdateData.title,
            body: postUpdateData.body,
            author: {
                id: user.id,
                username: user.username,
            },
        });
    });

    test('DELETE /posts/:id', async () => {
        const { posts }: { posts: Post[] } = await request(postsUrl).json();
        const firstPost = head(posts) as Post;
        const [, cookie] = await authenticate(port, { id: firstPost.author.id });

        const response = await request
            .delete(`${postsUrl}${firstPost.id}`, {
                headers: {
                    cookie,
                },
            })
            .json();

        expect(response).toBe('');

        const err = (await request(`${postsUrl}${firstPost.id}`).json().catch(identity)) as Error;

        // Because `firstPost.id` is dynamic, we need to replace it with a constant, so our snapshot remains consistent.
        const testErr = err.message.replace(firstPost.id, 'GENERATED_POST_ID');
        expect(testErr).toMatchInlineSnapshot(
            `"(404) Could not find post with ID GENERATED_POST_ID"`,
        );
    });
});
