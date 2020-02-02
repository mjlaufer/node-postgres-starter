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
                        id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                        title: 'title1',
                        body: 'body1',
                        author: 'matthewjustin',
                    },
                ]),
            });

            expect(response.body.posts).toHaveLength(3);
        });
    });

    describe('POST /posts', () => {
        test('should create a post', async () => {
            expect.assertions(1);

            const response = await request(app)
                .post('/posts')
                .send({
                    title: 'newtitle',
                    body: 'newbody',
                    userId: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    title: 'newtitle',
                    body: 'newbody',
                }),
            );
        });
    });

    describe('GET /posts/:id', () => {
        test('should return a post', async () => {
            expect.assertions(1);

            const response = await request(app)
                .get('/posts/708000d9-a4b9-48bb-b3cc-ee6f184777b8')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                    title: 'title1',
                    body: 'body1',
                    author: 'matthewjustin',
                }),
            );
        });
    });

    describe('PUT /posts/:id', () => {
        test('should update a post', async () => {
            expect.assertions(1);

            const response = await request(app)
                .put('/posts/708000d9-a4b9-48bb-b3cc-ee6f184777b8')
                .send({
                    title: 'updatedtitle',
                    body: 'updatedbody',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: '708000d9-a4b9-48bb-b3cc-ee6f184777b8',
                    title: 'updatedtitle',
                    body: 'updatedbody',
                }),
            );
        });
    });

    describe('DELETE /posts/:id', () => {
        test('should delete a post', async () => {
            expect.assertions(1);

            const response = await request(app)
                .delete('/posts/708000d9-a4b9-48bb-b3cc-ee6f184777b8')
                .set('Accept', 'application/json')
                .expect(204);

            expect(response.body).toEqual({});
        });
    });
});
