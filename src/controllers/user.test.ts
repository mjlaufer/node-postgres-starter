import { Request, Response } from 'express';
import User from '../models/User';
import { fetchUsers, createUser } from './user';

jest.mock('../models/User', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create: jest.fn(),
    },
}));

describe('user controller', () => {
    const user = { id: 1, email: 'test@test.com' };
    let req: Request;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        res.send = jest.fn();
    });

    describe('#fetchUsers', () => {
        test('retrieves and sends a list of users', async () => {
            User.findAll = jest.fn().mockResolvedValue([user]);

            expect.assertions(2);

            await fetchUsers(req, res, next);

            expect(User.findAll).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ users: [user] });
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.findAll = jest.fn().mockRejectedValue(err);

            expect.assertions(1);

            await fetchUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });

    describe('#createUser', () => {
        test('creates and sends a new user', async () => {
            User.create = jest.fn().mockResolvedValue(user);
            const newUser = { email: 'test@test.com' };
            req.body = newUser;

            expect.assertions(2);

            await createUser(req, res, next);

            expect(User.create).toHaveBeenCalledWith(newUser);
            expect(res.send).toHaveBeenCalledWith(user);
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.create = jest.fn().mockRejectedValue(err);

            expect.assertions(1);

            await createUser(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
