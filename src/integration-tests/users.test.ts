import request from 'supertest';
import { knex, closeOpenHandles } from '../helpers/test-helpers';
import app from '../app';

describe('/users', () => {
    beforeEach(async () => {
        await knex.seed.run();
    });

    afterAll(async () => {
        await closeOpenHandles();
    });

    describe('GET /users', () => {
        test('should return users', async () => {
            expect.assertions(3);

            const response = await request(app)
                .get('/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.users).toHaveLength(3);
            expect(response.body.users[0]).toHaveProperty('email');
            expect(response.body.users[0]).toHaveProperty('username');
        });
    });

    describe('POST /users', () => {
        test('should create a user', async () => {
            expect.assertions(1);

            const response = await request(app)
                .post('/users')
                .send({
                    email: 'newuser@example.com',
                    username: 'newuser',
                    password: 'password',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    email: 'newuser@example.com',
                    username: 'newuser',
                }),
            );
        });
    });

    describe('GET /users/:id', () => {
        test('should return a user', async () => {
            expect.assertions(1);

            const response = await request(app)
                .get('/users/b9a75c4e-ff61-406b-95a6-6313d55c39fe')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                    email: 'user1@example.com',
                    username: 'user1',
                }),
            );
        });
    });

    describe('PUT /users/:id', () => {
        test('should update a user', async () => {
            expect.assertions(1);

            const response = await request(app)
                .put('/users/b9a75c4e-ff61-406b-95a6-6313d55c39fe')
                .send({
                    email: 'updateduser@test.com',
                    username: 'updateduser',
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual(
                expect.objectContaining({
                    id: 'b9a75c4e-ff61-406b-95a6-6313d55c39fe',
                    email: 'updateduser@test.com',
                    username: 'updateduser',
                }),
            );
        });
    });

    describe('DELETE /users/:id', () => {
        test('should delete a user', async () => {
            expect.assertions(1);

            const response = await request(app)
                .delete('/users/b9a75c4e-ff61-406b-95a6-6313d55c39fe')
                .set('Accept', 'application/json')
                .expect(204);

            expect(response.body).toEqual({});
        });
    });
});
