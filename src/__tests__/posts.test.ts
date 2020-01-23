import request from 'supertest';
import { closeOpenHandles } from '../helpers/test-helpers';
import app from '../app';

describe('GET /posts', () => {
    afterAll(async () => {
        await closeOpenHandles();
    });

    test('should return posts', async () => {
        expect.assertions(2);

        const response = await request(app)
            .get('/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual({
            posts: expect.arrayContaining([
                {
                    author: 'matthewjustin',
                    body: 'body1',
                    id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                    title: 'title1',
                },
            ]),
        });

        expect(response.body.posts).toHaveLength(3);
    });
});
