import { Request, Response } from 'express';
import User from '../models/User';
import { fetchUsers, fetchUser, createUser, updateUser, deleteUser } from './user';

jest.mock('../models/User', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));

describe('user controller', () => {
    const mockUser = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
    };
    let req: Request;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        res.send = jest.fn();
        res.status = jest.fn(() => res);
        res.end = jest.fn();
    });

    describe('#fetchUsers', () => {
        test('retrieves a list of users', async () => {
            User.findAll = jest.fn().mockResolvedValue([mockUser]);

            expect.assertions(2);

            await fetchUsers(req, res, next);

            expect(User.findAll).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ users: [mockUser] });
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.findAll = jest.fn().mockRejectedValue(err);

            expect.assertions(1);

            await fetchUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('#fetchUser', () => {
        test('retrieves the correct user', async () => {
            User.findById = jest.fn().mockResolvedValue(mockUser);
            req.params = { id: '1' };

            expect.assertions(2);

            await fetchUser(req, res, next);

            expect(User.findById).toHaveBeenCalledWith(mockUser.id);
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.findById = jest.fn().mockRejectedValue(err);
            req.params = { id: '1' };

            expect.assertions(1);

            await fetchUser(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('#createUser', () => {
        const newUser = {
            email: 'test@test.com',
            username: 'test_user',
        };

        test('creates a new user', async () => {
            User.create = jest.fn().mockResolvedValue(mockUser);
            req.body = newUser;

            expect.assertions(2);

            await createUser(req, res, next);

            expect(User.create).toHaveBeenCalledWith(newUser);
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.create = jest.fn().mockRejectedValue(err);
            req.body = newUser;

            expect.assertions(1);

            await createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('#updateUser', () => {
        const updatedUser = {
            id: 1,
            email: 'test@test.com',
            username: 'updated_user',
        };

        test('updates a user', async () => {
            User.update = jest.fn().mockResolvedValue(updatedUser);
            req.body = updatedUser;

            expect.assertions(2);

            await updateUser(req, res, next);

            expect(User.update).toHaveBeenCalledWith(updatedUser);
            expect(res.send).toHaveBeenCalledWith(updatedUser);
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.update = jest.fn().mockRejectedValue(err);
            req.body = updatedUser;

            expect.assertions(1);

            await updateUser(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('#deleteUser', () => {
        test('deletes a user', async () => {
            User.destroy = jest.fn();
            req.params = { id: '1' };

            expect.assertions(2);

            await deleteUser(req, res, next);

            expect(User.destroy).toHaveBeenCalledWith(mockUser.id);
            expect(res.end).toHaveBeenCalled();
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.destroy = jest.fn().mockRejectedValue(err);
            req.params = { id: '1' };

            expect.assertions(1);

            await deleteUser(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
