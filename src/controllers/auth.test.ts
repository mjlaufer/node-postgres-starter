import { Request, Response } from 'express';
import User from '../models/User';
import { signup } from './auth';

jest.mock('../models/User', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('auth controller', () => {
    const mockUser = {
        id: 1,
        email: 'test@test.com',
        username: 'test_user',
        password: '$2a$10$37xEfpMwqmfSCAfYlaMzS.trfLiJEqpk4gk.OegKglZRQNw3LIUWG',
    };
    let req: Request;
    let res: Response;
    const next = jest.fn();

    beforeEach(() => {
        req = {} as Request;
        res = {} as Response;
        req.login = jest.fn();
        res.send = jest.fn();
    });

    describe('#signup', () => {
        const signupCredentials = {
            email: 'test@test.com',
            username: 'test_user',
            password: 'test',
        };

        test('creates a new user', async () => {
            User.create = jest.fn().mockResolvedValue(mockUser);
            req.body = signupCredentials;

            expect.assertions(2);

            await signup(req, res, next);

            expect(User.create).toHaveBeenCalledWith(signupCredentials);
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });

        test('passes error to next() if unsuccessful', async () => {
            const err = new Error('Database error');
            User.create = jest.fn().mockRejectedValue(err);
            req.body = signupCredentials;

            expect.assertions(1);

            await signup(req, res, next);

            expect(next).toHaveBeenCalledWith(err);
        });
    });
});
