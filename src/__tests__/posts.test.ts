import { identity, isString } from 'lodash';
import { startServer, Server } from '@server';
import { apiClient, closeOpenHandles, resetDb } from '@test/utils';
import { Post } from '@types';

describe('/posts', () => {
    let baseUrl: string;
    let server: Server;

    beforeAll(async () => {
        server = await startServer();
        const address = server.address();
        const port = isString(address) ? '0' : address?.port;
        baseUrl = `http://localhost:${port}/posts/`;
    });

    beforeEach(() => resetDb());

    afterAll(async () => {
        await Promise.all([closeOpenHandles(), server.close()]);
    });

    test('GET /posts', async () => {
        const response: { posts: Post[] } = await apiClient(baseUrl).json();

        for (const post of response.posts) {
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
            expect(post).toHaveProperty('author');
        }
    });

    test('GET /posts/:id', async () => {
        const postId = '708000d9-a4b9-48bb-b3cc-ee6f184777b8';
        const response: Post = await apiClient(`${baseUrl}${postId}`).json();

        expect(response).toEqual(
            expect.objectContaining({
                id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                title: 'fermentum',
                body:
                    'fermentum leo vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non',
                author: 'user1',
            }),
        );
    });

    test('POST /posts', async () => {
        const response: Post = await apiClient
            .post(baseUrl, {
                json: {
                    title: 'newtitle',
                    body: 'newbody',
                    userId: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                },
            })
            .json();

        expect(response).toEqual(
            expect.objectContaining({
                title: 'newtitle',
                body: 'newbody',
            }),
        );
    });

    test('PUT /posts/:id', async () => {
        const postId = '708000d9-a4b9-48bb-b3cc-ee6f184777b8';
        const response: Post = await apiClient
            .put(`${baseUrl}${postId}`, {
                json: {
                    title: 'updatedtitle',
                    body: 'updatedbody',
                },
            })
            .json();

        expect(response).toEqual(
            expect.objectContaining({
                id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                title: 'updatedtitle',
                body: 'updatedbody',
            }),
        );
    });

    test('DELETE /posts/:id', async () => {
        const postId = '708000d9-a4b9-48bb-b3cc-ee6f184777b8';
        const response = await apiClient.delete(`${baseUrl}${postId}`).json();

        expect(response).toBe('');

        const err = await apiClient(`${baseUrl}${postId}`).catch(identity);
        expect(err).toMatchInlineSnapshot(`[HTTPError: Response code 404 (Not Found)]`);
    });
});
