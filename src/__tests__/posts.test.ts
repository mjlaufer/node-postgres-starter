import request from 'supertest';
import { knex, closeOpenHandles } from '../helpers/test-helpers';
import app from '../app';

describe('/posts', () => {
    beforeEach(async () => {
        await knex.seed.run();
    });

    afterAll(async () => {
        await closeOpenHandles();
    });

    describe('GET /posts', () => {
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
});
